import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { ActionButton, PageIntro, Pill, SectionTitle, SegmentedControl, Surface } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';

type DietTone = 'success' | 'warning' | 'maroon' | 'neutral';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  tag?: string;
  tagTone?: DietTone;
};

type Venue = {
  operator: string;
  location: string;
  hours: string;
  outdoor?: boolean;
};

type Vendor = {
  id: string;
  label: string;
  name: string;
  cuisine: string;
  venue?: Venue;
  items: MenuItem[];
};

// The indoor stations reflect the real BK Campus Eats concepts in the Lower
// Level of Boylan Hall at Brooklyn College. Menu items and prices are
// representative demo data.
const DINING_HALL: Venue = {
  operator: 'BK Campus Eats',
  location: 'Lower Level, Boylan Hall',
  hours: 'Mon–Thu 8 AM – 7 PM · Fri 9 AM – 4 PM',
};

// Outdoor food van parked on campus — a separate section from the indoor hall.
const MATTO_VAN: Venue = {
  operator: 'Matto Nomad Van',
  location: 'Outside · East Quad walkway',
  hours: 'Mon–Fri 8 AM – 3 PM · weather permitting',
  outdoor: true,
};

const VENDORS: Vendor[] = [
  {
    id: 'latin',
    label: 'Latin',
    name: 'Latin Kitchen',
    cuisine: 'Latin specialties',
    items: [
      { id: 'la-1', name: 'Pollo a la Plancha Bowl', description: 'Grilled chicken, yellow rice, black beans', price: 9.25 },
      { id: 'la-2', name: 'Beef Empanadas (2)', description: 'Flaky pastry, seasoned ground beef', price: 5.5 },
      { id: 'la-3', name: 'Sweet Plantains', description: 'Maduros, lightly caramelized', price: 3.25, tag: 'Vegan', tagTone: 'success' },
    ],
  },
  {
    id: 'caribbean',
    label: 'Caribbean',
    name: 'Caribbean Corner',
    cuisine: 'Caribbean offerings',
    items: [
      { id: 'ca-1', name: 'Jerk Chicken Plate', description: 'Rice and peas, fried plantain', price: 9.75, tag: 'Halal', tagTone: 'maroon' },
      { id: 'ca-2', name: 'Curry Chickpeas', description: 'Coconut curry, steamed rice', price: 8.0, tag: 'Vegan', tagTone: 'success' },
      { id: 'ca-3', name: 'Beef Patty', description: 'Flaky Jamaican-style patty', price: 3.5 },
    ],
  },
  {
    id: 'italian',
    label: 'Italian',
    name: 'Trattoria',
    cuisine: 'Italian dishes',
    items: [
      { id: 'it-1', name: 'Chicken Parmigiana', description: 'Marinara, mozzarella, penne', price: 9.5 },
      { id: 'it-2', name: 'Penne alla Vodka', description: 'Creamy tomato, parmesan', price: 8.25, tag: 'Veg', tagTone: 'success' },
      { id: 'it-3', name: 'Garlic Bread', description: 'Toasted, herb butter', price: 2.95, tag: 'Veg', tagTone: 'success' },
    ],
  },
  {
    id: 'mediterranean',
    label: 'Mediterranean',
    name: 'Mediterraneo',
    cuisine: 'Mediterranean fare',
    items: [
      { id: 'me-1', name: 'Chicken Shawarma Platter', description: 'Rice, salad, garlic sauce', price: 9.95, tag: 'Halal', tagTone: 'maroon' },
      { id: 'me-2', name: 'Falafel Wrap', description: 'Hummus, tahini, pickled veg', price: 7.5, tag: 'Vegan', tagTone: 'success' },
      { id: 'me-3', name: 'Hummus & Pita', description: 'House hummus, warm pita', price: 4.25, tag: 'Vegan', tagTone: 'success' },
    ],
  },
  {
    id: 'south-asian',
    label: 'South Asian',
    name: 'Spice Route',
    cuisine: 'South Asian specialties',
    items: [
      { id: 'sa-1', name: 'Chicken Biryani', description: 'Basmati rice, raita', price: 9.5, tag: 'Halal', tagTone: 'maroon' },
      { id: 'sa-2', name: 'Chana Masala', description: 'Chickpea curry, naan', price: 8.25, tag: 'Vegan', tagTone: 'success' },
      { id: 'sa-3', name: 'Vegetable Samosa (2)', description: 'Potato, peas, tamarind chutney', price: 3.75, tag: 'Veg', tagTone: 'success' },
    ],
  },
  {
    id: 'grill-deli',
    label: 'Grill & Deli',
    name: 'The Grill & Deli',
    cuisine: 'Hot off the grill',
    items: [
      { id: 'gd-1', name: 'Classic Cheeseburger', description: 'Angus beef, cheddar, brioche bun', price: 7.5, tag: 'Popular', tagTone: 'maroon' },
      { id: 'gd-2', name: 'Bacon, Egg & Cheese', description: 'On a roll, served all day', price: 5.25 },
      { id: 'gd-3', name: 'Turkey Deli Sandwich', description: 'Lettuce, tomato, choice of bread', price: 6.75 },
      { id: 'gd-4', name: 'Mac & Cheese', description: 'Three-cheese, baked', price: 4.5, tag: 'Veg', tagTone: 'success' },
    ],
  },
  {
    id: 'pizza',
    label: 'Pizza',
    name: 'Pizzeria',
    cuisine: 'Brick-oven pizza',
    items: [
      { id: 'pz-1', name: 'Cheese Slice', description: 'Mozzarella, house marinara', price: 3.25, tag: 'Veg', tagTone: 'success' },
      { id: 'pz-2', name: 'Pepperoni Slice', description: 'Crispy pepperoni cups', price: 3.75, tag: 'Popular', tagTone: 'maroon' },
      { id: 'pz-3', name: 'Sicilian Square', description: 'Thick crust, tomato, basil', price: 4.0, tag: 'Veg', tagTone: 'success' },
    ],
  },
  {
    id: 'salad-bar',
    label: 'Salad Bar',
    name: 'Fresh & Green',
    cuisine: 'Build-your-own & grab-and-go',
    items: [
      { id: 'sb-1', name: 'Build-Your-Own Salad', description: 'Greens plus 5 toppings', price: 7.95, tag: 'GF', tagTone: 'success' },
      { id: 'sb-2', name: 'Greek Yogurt Parfait', description: 'Granola, berries, honey', price: 4.5, tag: 'Veg', tagTone: 'success' },
      { id: 'sb-3', name: 'Fresh Fruit Cup', description: 'Seasonal cut fruit', price: 3.25, tag: 'Vegan', tagTone: 'success' },
    ],
  },
  {
    id: 'pan-asian',
    label: 'Sushi & Boba',
    name: 'Pan-Asian Bar',
    cuisine: 'Sushi, onigiri & bubble tea',
    items: [
      { id: 'pa-1', name: 'California Roll', description: '8 pieces, crab, avocado, cucumber', price: 7.25, tag: 'Popular', tagTone: 'maroon' },
      { id: 'pa-2', name: 'Salmon Avocado Roll', description: '8 pieces, fresh salmon', price: 8.5 },
      { id: 'pa-3', name: 'Onigiri', description: 'Seasoned rice ball, seaweed', price: 3.5 },
      { id: 'pa-4', name: 'Classic Milk Boba Tea', description: '16 oz, tapioca pearls', price: 5.25, tag: 'Veg', tagTone: 'success' },
    ],
  },
  {
    id: 'harvest',
    label: 'Bagels & Coffee',
    name: 'Harvest Bagels & Coffee Shop',
    cuisine: 'Espresso, smoothies & pastries',
    items: [
      { id: 'hv-1', name: 'Bagel with Cream Cheese', description: 'Toasted, choice of bagel', price: 3.25, tag: 'Veg', tagTone: 'success' },
      { id: 'hv-2', name: 'Cappuccino', description: 'Double shot, steamed milk', price: 4.25 },
      { id: 'hv-3', name: 'Cold Brew Coffee', description: '16 oz, house roast', price: 3.75, tag: 'Vegan', tagTone: 'success' },
      { id: 'hv-4', name: 'Mango Smoothie', description: 'Mango, banana, yogurt', price: 5.5, tag: 'Veg', tagTone: 'success' },
    ],
  },
  {
    id: 'matto-van',
    label: 'Matto Nomad Van',
    name: 'Matto Nomad Van',
    cuisine: 'Italian espresso bar · fixed $3 coffee & cornetti',
    venue: MATTO_VAN,
    items: [
      { id: 'mt-1', name: 'Cappuccino', description: 'Italian-style, $3 fixed price', price: 3.0, tag: 'Popular', tagTone: 'maroon' },
      { id: 'mt-2', name: 'Caffè Latte', description: 'Espresso and steamed milk', price: 3.0 },
      { id: 'mt-3', name: 'Espresso', description: 'Single or double shot', price: 2.0 },
      { id: 'mt-4', name: 'Iced Matcha Latte', description: 'Ceremonial matcha, milk', price: 3.5, tag: 'Veg', tagTone: 'success' },
      { id: 'mt-5', name: 'Cornetto', description: 'Italian croissant, $3 fixed price', price: 3.0, tag: 'Veg', tagTone: 'success' },
      { id: 'mt-6', name: 'Chocolate Cornetto', description: 'Filled with chocolate cream', price: 3.0, tag: 'Veg', tagTone: 'success' },
      { id: 'mt-7', name: 'Potato & Cheese Panini', description: 'Pressed, Matto signature', price: 5.5 },
      { id: 'mt-8', name: 'Salmon & Cream Cheese Bagel', description: 'Smoked salmon, toasted bagel', price: 6.5, tag: 'Kosher', tagTone: 'warning' },
    ],
  },
];

const PICKUP_SLOTS = ['ASAP (15 min)', 'In 30 min', 'In 1 hour'];

const ALL_ITEMS: Record<string, MenuItem & { vendorName: string }> = Object.fromEntries(
  VENDORS.flatMap((vendor) => vendor.items.map((item) => [item.id, { ...item, vendorName: vendor.name }])),
);

function formatUsd(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function CafeteriaScreen() {
  const [vendorId, setVendorId] = useState(VENDORS[0].id);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [pickupSlot, setPickupSlot] = useState(PICKUP_SLOTS[0]);
  const [placedOrder, setPlacedOrder] = useState<string | null>(null);

  const vendor = VENDORS.find((entry) => entry.id === vendorId) ?? VENDORS[0];
  const venueInfo = vendor.venue ?? DINING_HALL;

  const { itemCount, subtotal } = useMemo(() => {
    let count = 0;
    let total = 0;
    for (const [id, qty] of Object.entries(cart)) {
      const item = ALL_ITEMS[id];
      if (!item) continue;
      count += qty;
      total += item.price * qty;
    }
    return { itemCount: count, subtotal: total };
  }, [cart]);

  function changeQty(id: string, delta: number) {
    void Haptics.selectionAsync();
    setPlacedOrder(null);
    setCart((prev) => {
      const next = { ...prev };
      const value = (next[id] ?? 0) + delta;
      if (value <= 0) delete next[id];
      else next[id] = value;
      return next;
    });
  }

  function placeOrder() {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const orderNumber = `PUG-${Math.floor(1000 + Math.random() * 9000)}`;
    setPlacedOrder(orderNumber);
    setCart({});
  }

  return (
    <AppScaffold>
      <PageIntro
        eyebrow="Dining & Online Orders"
        title="Order ahead, skip the line."
        body="Browse the BK Campus Eats stations inside Boylan Hall plus the Matto Nomad Van outside, build your order, and schedule a pickup time. Pay with your meal plan or card at pickup."
      />

      <View style={styles.hallCard}>
        <View style={styles.hallIcon}>
          <Ionicons color={colors.white} name={venueInfo.outdoor ? 'cafe' : 'restaurant'} size={22} />
        </View>
        <View style={styles.hallCopy}>
          <View style={styles.hallNameRow}>
            <Text style={styles.hallName}>{venueInfo.operator}</Text>
            {venueInfo.outdoor ? <Text style={styles.outdoorBadge}>Outdoor</Text> : null}
          </View>
          <View style={styles.hallMetaRow}>
            <Ionicons color="rgba(255,255,255,.8)" name="location-outline" size={13} />
            <Text style={styles.hallMeta}>{venueInfo.location}</Text>
          </View>
          <View style={styles.hallMetaRow}>
            <View style={styles.statusDot} />
            <Text style={styles.hallMeta}>{venueInfo.hours}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.selectorLabel}>Vendors</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.chipRow}
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
      >
        {VENDORS.map((entry) => {
          const selected = entry.id === vendorId;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={entry.id}
              onPress={() => setVendorId(entry.id)}
              style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}
            >
              <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{entry.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <SectionTitle>{vendor.name}</SectionTitle>
      <Text style={styles.vendorCuisine}>{vendor.cuisine}</Text>
      <Surface>
        {vendor.items.map((item, index) => {
          const qty = cart[item.id] ?? 0;
          return (
            <View key={item.id} style={[styles.menuRow, index === vendor.items.length - 1 && styles.menuRowLast]}>
              <View style={styles.menuText}>
                <View style={styles.menuTitleRow}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  {item.tag ? <Pill tone={item.tagTone ?? 'neutral'}>{item.tag}</Pill> : null}
                </View>
                <Text style={styles.menuDescription}>{item.description}</Text>
                <Text style={styles.menuPrice}>{formatUsd(item.price)}</Text>
              </View>
              {qty === 0 ? (
                <Pressable
                  accessibilityLabel={`Add ${item.name} to order`}
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => changeQty(item.id, 1)}
                  style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
                >
                  <Ionicons color={colors.maroon} name="add" size={22} />
                </Pressable>
              ) : (
                <View style={styles.stepper}>
                  <Pressable
                    accessibilityLabel={`Remove one ${item.name}`}
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={() => changeQty(item.id, -1)}
                    style={({ pressed }) => [styles.stepperButton, pressed && styles.pressed]}
                  >
                    <Ionicons color={colors.maroon} name="remove" size={18} />
                  </Pressable>
                  <Text style={styles.stepperValue}>{qty}</Text>
                  <Pressable
                    accessibilityLabel={`Add one more ${item.name}`}
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={() => changeQty(item.id, 1)}
                    style={({ pressed }) => [styles.stepperButton, pressed && styles.pressed]}
                  >
                    <Ionicons color={colors.maroon} name="add" size={18} />
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </Surface>

      <SectionTitle>Pickup time</SectionTitle>
      <SegmentedControl onChange={setPickupSlot} options={PICKUP_SLOTS.map((slot) => ({ label: slot, value: slot }))} value={pickupSlot} />

      {placedOrder ? (
        <View style={styles.confirmCard}>
          <View style={styles.confirmIcon}>
            <Ionicons color={colors.green} name="checkmark-circle" size={26} />
          </View>
          <View style={styles.confirmCopy}>
            <Text style={styles.confirmTitle}>Order {placedOrder} placed</Text>
            <Text style={styles.confirmBody}>Pickup {pickupSlot.toLowerCase()} at {venueInfo.operator} · {venueInfo.location}. Show this number at the counter.</Text>
          </View>
        </View>
      ) : (
        <View style={styles.orderCard}>
          <View style={styles.orderSummaryRow}>
            <Text style={styles.orderLabel}>{itemCount === 0 ? 'Your order is empty' : `${itemCount} item${itemCount === 1 ? '' : 's'}`}</Text>
            <Text style={styles.orderTotal}>{formatUsd(subtotal)}</Text>
          </View>
          <ActionButton
            icon="bag-check-outline"
            label={itemCount === 0 ? 'Add items to order' : `Place order · ${formatUsd(subtotal)}`}
            onPress={placeOrder}
          />
        </View>
      )}

      <View style={styles.demoNote}>
        <Ionicons color={colors.amber} name="information-circle-outline" size={18} />
        <Text style={styles.demoText}>
          Vendors reflect real Brooklyn College dining — the {DINING_HALL.operator} stations in Boylan Hall and the Matto Nomad Van outside. Menu items, prices, and ordering are demo data — no payment is processed and no order is sent until official dining services are connected.
        </Text>
      </View>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  hallCard: {
    alignItems: 'center',
    backgroundColor: colors.maroon,
    borderRadius: radii.lg,
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
  },
  hallIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,.15)',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  hallCopy: { flex: 1, gap: 3 },
  hallNameRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  hallName: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 17 },
  outdoorBadge: {
    backgroundColor: 'rgba(255,255,255,.18)',
    borderRadius: radii.round,
    color: colors.white,
    fontFamily: fonts.uiBold,
    fontSize: 10,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
    textTransform: 'uppercase',
  },
  hallMetaRow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  statusDot: { backgroundColor: colors.green, borderRadius: 5, height: 8, width: 8 },
  hallMeta: { color: 'rgba(255,255,255,.82)', flex: 1, fontFamily: fonts.ui, fontSize: 12 },
  selectorLabel: {
    color: colors.ink,
    fontFamily: fonts.uiBold,
    fontSize: 18,
    marginBottom: spacing.md,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  chipScroll: { flexGrow: 0 },
  chipRow: { gap: spacing.sm, paddingHorizontal: spacing.lg },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.round,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: 9,
  },
  chipSelected: { backgroundColor: colors.maroon, borderColor: colors.maroon },
  chipLabel: { color: colors.inkMuted, fontFamily: fonts.uiMedium, fontSize: 14 },
  chipLabelSelected: { color: colors.white, fontFamily: fonts.uiBold },
  vendorCuisine: {
    color: colors.inkMuted,
    fontFamily: fonts.ui,
    fontSize: 13,
    marginBottom: spacing.md,
    marginTop: -spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  menuRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuRowLast: { borderBottomWidth: 0 },
  menuText: { flex: 1 },
  menuTitleRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  menuName: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 15, lineHeight: 19 },
  menuDescription: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 13, lineHeight: 18, marginTop: 3 },
  menuPrice: { color: colors.maroon, fontFamily: fonts.uiBold, fontSize: 14, marginTop: 6 },
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.maroonSoft,
    borderRadius: radii.round,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
  stepper: {
    alignItems: 'center',
    backgroundColor: colors.maroonSoft,
    borderRadius: radii.round,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  stepperButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.round,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  stepperValue: { color: colors.maroon, fontFamily: fonts.uiBold, fontSize: 15, minWidth: 16, textAlign: 'center' },
  orderCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  orderSummaryRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  orderLabel: { color: colors.inkMuted, fontFamily: fonts.uiMedium, fontSize: 14 },
  orderTotal: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 20 },
  confirmCard: {
    alignItems: 'center',
    backgroundColor: colors.greenSoft,
    borderRadius: radii.lg,
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  confirmIcon: { alignItems: 'center', justifyContent: 'center' },
  confirmCopy: { flex: 1 },
  confirmTitle: { color: colors.green, fontFamily: fonts.uiBold, fontSize: 16 },
  confirmBody: { color: colors.ink, fontFamily: fonts.ui, fontSize: 13, lineHeight: 18, marginTop: 3 },
  demoNote: {
    alignItems: 'flex-start',
    backgroundColor: colors.amberSoft,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.md,
  },
  demoText: { color: colors.amber, flex: 1, fontFamily: fonts.uiMedium, fontSize: 12, lineHeight: 17 },
});
