import React from 'react'

import { ScrollView, View } from 'react-native'

export const FlashList = React.forwardRef(
  (
    {
      data,
      renderItem,
      ListEmptyComponent,
      ListHeaderComponent,
      ListFooterComponent,
      refreshControl,
      onEndReached,
      onEndReachedThreshold,
      estimatedItemSize,
      ...props
    }: any,
    ref: any,
  ) => {
    React.useImperativeHandle(ref, () => ({
      scrollToOffset: jest.fn(),
      scrollToIndex: jest.fn(),
      scrollToItem: jest.fn(),
      scrollToEnd: jest.fn(),
      prepareForLayoutAnimationRender: jest.fn(),
      recordInteraction: jest.fn(),
      getScrollableNode: jest.fn(),
    }))

    return (
      <ScrollView
        accessibilityRole="list"
        data={data}
        renderItem={renderItem}
        refreshControl={refreshControl}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        {...props}
      >
        {ListHeaderComponent ? (
          <View>
            {typeof ListHeaderComponent === 'function' ? (
              <ListHeaderComponent />
            ) : (
              ListHeaderComponent
            )}
          </View>
        ) : null}
        {data && data.length > 0 ? (
          data.map((item: any, index: number) =>
            renderItem ? (
              <View key={index}>{renderItem({ item, index })}</View>
            ) : null,
          )
        ) : ListEmptyComponent ? (
          typeof ListEmptyComponent === 'function' ? (
            <ListEmptyComponent />
          ) : (
            ListEmptyComponent
          )
        ) : null}
        {ListFooterComponent ? (
          typeof ListFooterComponent === 'function' ? (
            <ListFooterComponent />
          ) : (
            ListFooterComponent
          )
        ) : null}
      </ScrollView>
    )
  },
)

export default FlashList
