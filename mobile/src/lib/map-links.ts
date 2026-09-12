import { Linking, Platform } from 'react-native';

const CAMPUS_ADDRESS = '2900 Bedford Avenue, Brooklyn, NY 11210';

type MapDestination = {
  name: string;
  building?: string;
};

export function destinationQuery({ name, building }: MapDestination) {
  return [name, building, 'Brooklyn College', CAMPUS_ADDRESS].filter(Boolean).join(', ');
}

export function directionsUrl(destination: string, platform = Platform.OS) {
  const encodedDestination = encodeURIComponent(destination);

  if (platform === 'ios') {
    return `https://maps.apple.com/?daddr=${encodedDestination}&dirflg=w`;
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}&travelmode=walking`;
}

export function openMapDirections(destination: MapDestination) {
  return Linking.openURL(directionsUrl(destinationQuery(destination)));
}
