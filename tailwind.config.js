/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./Navigation.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        mono: ["SpaceMono"],
      },
      filter: {
        dropShadowDark: "drop-shadow(0 1px 1px rgb(255 255 255 / 1))",
        dropShadowLight: "drop-shadow(0 1px 1px rgb(0 0 0 / 1))",
      },
      colors: {
        border: "#1a332a",
        input: "#243f34",
        ring: "#274b36",
        background: "#0d1c11",
        foreground: "#a9ffea",
        primary: {
          DEFAULT: "#62dfa0",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#1cd7a2",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#26a879",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#1a1e19",
          foreground: "#b3b3c0",
        },
        accent: {
          DEFAULT: "#eaffff",
          foreground: "#1a1a1a",
        },
        popover: {
          DEFAULT: "#1c1e19",
          foreground: "#e4f3f4",
        },
        card: {
          DEFAULT: "#102314",
          foreground: "#e4f3f4",
        },
        'amarelo-200': '#D7AF70',
        'azul-400': '#0075FF',
        'branco-400': '#FFFFFF',
        'cinza-600': '#A29C9B',
        'cinza-400': '#EFEFEF',
        'preto-400': '#000000',
        'preto-300': '#222222',
        'verde-400': '#1C5E27',
        'verde-300': '#359830',
        'vermelho-400': '#C80B0F',
        'vermelho-200': '#8E4A49',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        outline: {
          '0%': {
            outlineColor: 'transparent'
          }
        },
        overlayShow: {
          from: {
            opacity: '0'
          },
          to: {
            opacity: '1'
          }
        },
        contentShow: {
          from: {
            opacity: '0',
            transform: 'translate(-50%, -48%) scale(0.96)'
          },
          to: {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1)'
          }
        },
        slideDownAndFade: {
          from: {
            opacity: '0',
            transform: 'translateY(-2px)'
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        slideLeftAndFade: {
          from: {
            opacity: '0',
            transform: 'translateX(2px)'
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        slideUpAndFade: {
          from: {
            opacity: '0',
            transform: 'translateY(2px)'
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        slideRightAndFade: {
          from: {
            opacity: '0',
            transform: 'translateX(-2px)'
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        outline: 'outline .25s ease-in-out',
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)'
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};