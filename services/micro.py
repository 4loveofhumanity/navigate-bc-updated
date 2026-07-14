"""Tiny shared runtime for Pugliese Navigate microservices.

Each service passes a name, port, and a dict of route -> JSON-serializable
payload. Payload values may also be zero-arg callables, evaluated per request.
"""
import http.server
import json
import socketserver


def run(name, port, routes):
    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            path = self.path.split("?")[0]
            if path != "/" :
                path = path.rstrip("/")
            payload = routes.get(path)
            if payload is None:
                self._send(404, {"error": "not found", "service": name, "path": path})
                return
            if callable(payload):
                payload = payload()
            self._send(200, payload)

        def _send(self, code, obj):
            body = json.dumps(obj).encode("utf-8")
            self.send_response(code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *args):
            pass

    class Server(socketserver.ThreadingTCPServer):
        allow_reuse_address = True
        daemon_threads = True

    with Server(("127.0.0.1", port), Handler) as srv:
        print(f"[{name}] listening on http://127.0.0.1:{port}", flush=True)
        srv.serve_forever()
