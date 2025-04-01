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
      pageX: 0,
      pageY: 0,
      width: 0,
      height: 0,
    });
    const triggerRef = React.useRef<View>(null);

    const handleOpenTooltip = () => {
      if (triggerRef.current) {
        triggerRef.current.measureInWindow((x, y, width, height) => {
          setTooltipLayout({
            pageX: x,
            pageY: y,
            width,
            height,
          });
          setIsOpen(true);
        });
      }
    };

    const handleCloseTooltip = () => setIsOpen(false);

    return (
      <View ref={ref}>
        <Pressable ref={triggerRef} onPress={handleOpenTooltip}>
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
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              className="absolute"
              style={{
                top: tooltipLayout.pageY + tooltipLayout.height + 5,
                left: tooltipLayout.pageX - 16,
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
