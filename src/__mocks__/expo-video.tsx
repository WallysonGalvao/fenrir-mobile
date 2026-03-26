import React from 'react';

import { Text, View } from 'react-native';

const mockPlayer = {
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  release: jest.fn(),
  isPlaying: false,
  generateThumbnailsAsync: jest.fn(() =>
    Promise.resolve([
      {
        uri: 'mocked-thumbnail-uri',
        requestedTime: 1,
        actualTime: 1,
        width: 100,
        height: 100,
      },
    ]),
  ),
};

export const useVideoPlayer = jest.fn(() => mockPlayer);

export const createVideoPlayer = jest.fn(() => mockPlayer);

export const VideoView = React.forwardRef<any, any>((props, _ref) => {
  return (
    <View testID="mock-video-view">
      <Text>Mocked VideoView</Text>
      {props.children}
    </View>
  );
});
