import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';

interface HtmlContentProps {
  html: string;
  baseStyle?: {
    fontSize?: number;
    lineHeight?: number;
  };
}

/**
 * Composant pour afficher du contenu HTML (WYSIWYG depuis Directus)
 */
export function HtmlContent({ html, baseStyle = {} }: HtmlContentProps) {
  const { width } = useWindowDimensions();
  const textColor = useThemeColor({}, 'text');
  const linkColor = useThemeColor({ light: '#0a7ea4', dark: '#4FC3F7' }, 'tint');

  const systemFonts = [
    ...defaultSystemFonts,
    'System',
  ];

  const tagsStyles = {
    body: {
      color: textColor,
      fontSize: baseStyle.fontSize || 16,
      lineHeight: baseStyle.lineHeight || 26,
    },
    p: {
      marginBottom: 15,
      color: textColor,
    },
    a: {
      color: linkColor,
      textDecorationLine: 'underline' as const,
    },
    h1: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      marginBottom: 15,
      marginTop: 20,
      color: textColor,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      marginBottom: 12,
      marginTop: 18,
      color: textColor,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      marginBottom: 10,
      marginTop: 15,
      color: textColor,
    },
    ul: {
      marginBottom: 15,
    },
    ol: {
      marginBottom: 15,
    },
    li: {
      marginBottom: 8,
      color: textColor,
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: linkColor,
      paddingLeft: 15,
      marginVertical: 15,
      fontStyle: 'italic' as const,
      color: textColor,
    },
    code: {
      backgroundColor: '#f5f5f5',
      padding: 4,
      borderRadius: 4,
      fontFamily: 'monospace',
    },
    pre: {
      backgroundColor: '#f5f5f5',
      padding: 15,
      borderRadius: 8,
      marginVertical: 15,
      overflow: 'hidden' as const,
    },
    strong: {
      fontWeight: 'bold' as const,
    },
    em: {
      fontStyle: 'italic' as const,
    },
  };

  return (
    <RenderHtml
      contentWidth={width - 40} // Largeur moins le padding
      source={{ html }}
      tagsStyles={tagsStyles}
      systemFonts={systemFonts}
    />
  );
}
