import React, { useState, forwardRef } from "react";
import { View, Modal, Pressable, Dimensions } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutDown,
} from "react-native-reanimated";

interface TooltipProps {
  triggerElement: React.ReactNode;
  contentElement: React.ReactNode;
  defaultOpen?: boolean;
}

export const Tooltip = forwardRef<View, TooltipProps>(
  ({ contentElement, triggerElement, defaultOpen }, ref) => {
    const [isOpen, setIsOpen] = useState(defaultOpen ?? false);
    const [tooltipLayout, setTooltipLayout] = useState({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });

    const handleOpenTooltip = () => setIsOpen(true);
    const handleCloseTooltip = () => setIsOpen(false);

    return (
      <View ref={ref}>
        <Pressable
          onPress={handleOpenTooltip}
          onLayout={(event) => {
            const { x, y, width, height } = event.nativeEvent.layout;
            setTooltipLayout({ x, y, width, height });
          }}
        >
          {triggerElement}
        </Pressable>

        <Modal
          transparent
          visible={isOpen}
          animationType="none"
          onRequestClose={handleCloseTooltip}
        >
          <Pressable
            className="flex-1 bg-black/20"
            onPress={handleCloseTooltip}
          >
            <Animated.View
              entering={FadeIn.duration(200).withCallback(() => {
                "worklet";
                // Callback when animation starts
              })}
              exiting={FadeOut.duration(200)}
              className="absolute"
              style={{
                top: tooltipLayout.y + tooltipLayout.height + 5,
                left: Math.max(
                  10,
                  Math.min(
                    tooltipLayout.x,
                    Dimensions.get("window").width - 250
                  )
                ),
              }}
            >
              <Animated.View
                entering={SlideInUp}
                exiting={SlideOutDown}
                className="bg-white rounded-lg shadow-lg p-4 max-w-[240px] border border-gray-200"
              >
                {contentElement}
                <View className="absolute -top-2 left-4 w-4 h-4 rotate-45 bg-white border-t border-l border-gray-200" />
              </Animated.View>
            </Animated.View>
          </Pressable>
        </Modal>
      </View>
    );
  }
);

Tooltip.displayName = "Tooltip";
