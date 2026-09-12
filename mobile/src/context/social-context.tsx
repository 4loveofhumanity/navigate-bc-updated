import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

export type Friend = {
  id: string;
  name: string;
  code: string;
  accent: string;
  addedVia: 'seed' | 'nearby' | 'nfc' | 'invite';
  /** Minutes of proximity time accumulated together on campus. */
  minutesTogether: number;
  /** Where they most often are on campus. */
  location: string;
};

export type Message = { id: string; fromMe: boolean; text: string; ts: number };

type SocialData = {
  me: { name: string; code: string };
  friends: Friend[];
  conversations: Record<string, Message[]>;
};

const STORAGE_KEY = 'pugliese-navigate.social.v2';

const SEED_FRIENDS: Friend[] = [
  { id: 'f-nahid', name: 'Nahid', code: 'BC-1042', accent: '#5E82B7', addedVia: 'seed', minutesTogether: 860, location: 'Chemistry Lab · H 1141' },
  { id: 'f-shajid', name: 'Shajid', code: 'BC-2213', accent: '#A8324A', addedVia: 'seed', minutesTogether: 545, location: 'Library · 3rd Floor' },
  { id: 'f-prova', name: 'Prova', code: 'BC-3387', accent: '#2F8F6B', addedVia: 'seed', minutesTogether: 400, location: 'Student Center' },
  { id: 'f-hana', name: 'Hana', code: 'BC-4471', accent: '#B5761F', addedVia: 'seed', minutesTogether: 195, location: 'West Quad Building' },
  { id: 'f-juthi', name: 'Juthi', code: 'BC-5590', accent: '#6C4BB6', addedVia: 'seed', minutesTogether: 115, location: 'Campus Library' },
  { id: 'f-mahi', name: 'Mahi', code: 'BC-6601', accent: '#165D83', addedVia: 'seed', minutesTogether: 320, location: 'Student Center' },
];

const DEMO_REPLIES = ['got it 👍', 'sounds good', 'see you there', 'haha okay', 'thanks!', 'on my way', 'yeah for sure'];

const DEFAULT: SocialData = {
  me: { name: 'You', code: 'BC-0007' },
  friends: SEED_FRIENDS,
  conversations: {
    'f-nahid': [{ id: 'seed-m0', fromMe: false, text: 'yo are you on campus today?', ts: Date.now() - 3_600_000 }],
  },
};

type SocialContextValue = {
  me: SocialData['me'];
  friends: Friend[];
  conversations: Record<string, Message[]>;
  hydrated: boolean;
  inviteLink: string;
  addPeer: (peer: { name: string; code: string; accent: string }, via?: 'nearby' | 'nfc' | 'invite') => { friend: Friend; isNew: boolean };
  sendMessage: (friendId: string, text: string) => void;
};

const SocialContext = createContext<SocialContextValue | null>(null);

export function SocialProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<SocialData>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored && active) {
          const parsed = JSON.parse(stored) as Omit<Partial<SocialData>, 'friends'> & { friends?: Partial<Friend>[] };
          // Backfill fields added in later versions so older saved friends render.
          const rawFriends = parsed.friends ?? DEFAULT.friends;
          const friends = rawFriends.map((f) => ({ minutesTogether: 0, location: 'On campus', ...f })) as Friend[];
          setData({ ...DEFAULT, ...parsed, friends });
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (hydrated) void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  const addPeer = useCallback(
    (peer: { name: string; code: string; accent: string }, via: 'nearby' | 'nfc' | 'invite' = 'nearby') => {
      const existing = data.friends.find((f) => f.code === peer.code);
      if (existing) return { friend: existing, isNew: false };
      const friend: Friend = { id: `f-${peer.code}`, name: peer.name, code: peer.code, accent: peer.accent, addedVia: via, minutesTogether: 0, location: 'Nearby · just now' };
      setData((prev) => (prev.friends.some((f) => f.code === peer.code) ? prev : { ...prev, friends: [friend, ...prev.friends] }));
      return { friend, isNew: true };
    },
    [data.friends],
  );

  const sendMessage = useCallback((friendId: string, text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const mine: Message = { id: `m-${Date.now()}`, fromMe: true, text: clean, ts: Date.now() };
    setData((prev) => ({
      ...prev,
      conversations: { ...prev.conversations, [friendId]: [...(prev.conversations[friendId] ?? []), mine] },
    }));
    // Simulated reply so the thread feels alive in the demo.
    setTimeout(() => {
      const reply: Message = {
        id: `r-${Date.now()}`,
        fromMe: false,
        text: DEMO_REPLIES[Math.floor(Math.random() * DEMO_REPLIES.length)],
        ts: Date.now(),
      };
      setData((prev) => ({
        ...prev,
        conversations: { ...prev.conversations, [friendId]: [...(prev.conversations[friendId] ?? []), reply] },
      }));
    }, 1400);
  }, []);

  const inviteLink = useMemo(
    () => `pugliesenavigate://add-friend?code=${data.me.code}&name=${encodeURIComponent(data.me.name)}`,
    [data.me],
  );

  const value = useMemo(
    () => ({ me: data.me, friends: data.friends, conversations: data.conversations, hydrated, inviteLink, addPeer, sendMessage }),
    [data, hydrated, inviteLink, addPeer, sendMessage],
  );

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
}

export function useSocial() {
  const value = useContext(SocialContext);
  if (!value) throw new Error('useSocial must be used inside SocialProvider');
  return value;
}
