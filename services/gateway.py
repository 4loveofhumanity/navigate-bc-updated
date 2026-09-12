"""API gateway — serves the frontend and proxies /api/<service>/* to the
feature microservices. Also supervises the service processes so a single
command boots the whole stack."""
import atexit
import http.server
import json
import os
import socketserver
import subprocess
import sys
import urllib.request

# PORT follows the platform convention ($PORT on DigitalOcean App Platform,
# Heroku, etc.) and falls back to the local default.
PORT = int(os.environ.get("PORT") or os.environ.get("BC_GATEWAY_PORT") or 8641)
HOST = os.environ.get("BC_GATEWAY_HOST", "127.0.0.1")
BASE = os.path.dirname(os.path.abspath(__file__))
FRONTEND = os.path.normpath(os.path.join(BASE, "..", "frontend"))
# In production, point BC_WEB_DIR at the Expo web export (single-page build) to
# serve the native app's web bundle; otherwise serve the legacy browser prototype.
WEB_DIR = os.path.normpath(os.environ.get("BC_WEB_DIR", "").strip() or FRONTEND)
ALLOWED_ORIGINS = {
    origin.strip()
    for origin in os.environ.get(
        "BC_ALLOWED_ORIGINS",
        "http://127.0.0.1:8650,http://localhost:8650,http://127.0.0.1:8081,http://localhost:8081",
    ).split(",")
    if origin.strip()
}

SERVICES = {
    "info":    ("info_service.py",    8642),
    "catalog": ("catalog_service.py", 8643),
    "map":     ("map_service.py",     8644),
    "library": ("library_service.py", 8645),
    "nearby":  ("nearby_service.py",  8646),
    "calendar": ("academic_calendar_service.py", 8647),
    "student-id": ("student_id_service.py", 8648),
}

_children = []


def start_services():
    for name, (script, _port) in SERVICES.items():
        proc = subprocess.Popen([sys.executable, os.path.join(BASE, script)])
        _children.append(proc)
        print(f"[gateway] started {name} (pid {proc.pid})", flush=True)


@atexit.register
def stop_services():
    for proc in _children:
        try:
            proc.terminate()
        except OSError:
            pass


class GatewayHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_DIR, **kwargs)

    def do_GET(self):
        if self.path.startswith("/api/"):
            self._proxy()
            return
        self._serve_web()

    def _serve_web(self):
        """Serve a static file; map extensionless routes to <route>.html and
        fall back to index.html so Expo Router client routes resolve on reload."""
        route = self.path.split("?", 1)[0].split("#", 1)[0]
        fs_path = self.translate_path(self.path)
        if os.path.isdir(fs_path) or os.path.isfile(fs_path):
            super().do_GET()
            return
        html_candidate = fs_path.rstrip("/\\") + ".html"
        if os.path.isfile(html_candidate):
            self.path = route.rstrip("/") + ".html"
            super().do_GET()
            return
        self.path = "/index.html"
        super().do_GET()

    def do_OPTIONS(self):
        if not self.path.startswith("/api/"):
            self.send_error(404)
            return
        self.send_response(204)
        self._send_cors_headers()
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Accept, Content-Type")
        self.send_header("Access-Control-Max-Age", "600")
        self.end_headers()

    def _proxy(self):
        parts = self.path.split("/", 3)  # "", "api", service, rest
        service = parts[2] if len(parts) > 2 else ""
        rest = "/" + (parts[3] if len(parts) > 3 else "")
        if service not in SERVICES:
            self._send_json(404, {"error": f"unknown service '{service}'"})
            return
        port = SERVICES[service][1]
        try:
            with urllib.request.urlopen(
                    f"http://127.0.0.1:{port}{rest}", timeout=3) as resp:
                body = resp.read()
                self.send_response(resp.status)
                self.send_header("Content-Type", "application/json")
                self.send_header("Cache-Control", "no-store")
                self.send_header("Content-Length", str(len(body)))
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(body)
        except Exception as exc:
            self._send_json(502, {"error": f"{service} service unavailable",
                                  "detail": str(exc)})

    def _send_json(self, code, obj):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def _send_cors_headers(self):
        origin = self.headers.get("Origin")
        if origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")

    def log_message(self, *args):
        pass


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    start_services()
    with Server((HOST, PORT), GatewayHandler) as srv:
        print(f"[gateway] serving frontend + API on http://{HOST}:{PORT}",
              flush=True)
        srv.serve_forever()
