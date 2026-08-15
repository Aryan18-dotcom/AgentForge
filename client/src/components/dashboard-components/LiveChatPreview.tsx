import { useRef, useEffect } from 'react';

export interface LiveChatPreviewProps {
  agentName: string;
  backboneModel: string;
  primaryColor: string;
  secondaryColor: string;
  surfaceColor: string;
  borderRadius: number;
  isThinking?: boolean;
  renderMode?: 'minimized' | 'expanded';
  launcherType?: 'icon' | 'text' | 'combined';
  logoSource?: 'glyph' | 'custom';
  selectedGlyph?: 'sparkle' | 'bot' | 'terminal';
  customLogoUrl?: string | null;
  launcherText?: string;
}

export default function LiveChatPreview({
  agentName, backboneModel, primaryColor, secondaryColor,
  surfaceColor, borderRadius, isThinking = false,
  renderMode = 'expanded', launcherType = 'combined',
  logoSource = 'glyph', selectedGlyph = 'sparkle', customLogoUrl = null, 
  launcherText = 'Chat with assistant'
}: LiveChatPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 340;
    const height = 420;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number, fillStyle: string, strokeStyle?: string) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fillStyle = fillStyle;
      ctx.fill();
      if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const getGlyphSymbol = () => {
      if (selectedGlyph === 'bot') return '🤖';
      if (selectedGlyph === 'terminal') return '⌨';
      return '✧';
    };

    // ✅ HELPER: Programmatic Canvas Ellipsis Truncation Engine
    const getTruncatedText = (text: string, maxWidth: number) => {
      if (ctx.measureText(text).width <= maxWidth) return text;
      
      let truncated = text;
      while (truncated.length > 0 && ctx.measureText(truncated + '...').width > maxWidth) {
        truncated = truncated.slice(0, -1);
      }
      return truncated.trim() + '...';
    };

    const drawLauncherIcon = (cX: number, cY: number, radius: number, onImageLoaded: () => void) => {
      if (logoSource === 'custom' && customLogoUrl) {
        const img = new Image();
        img.src = customLogoUrl;
        img.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(cX, cY, radius, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, cX - radius, cY - radius, radius * 2, radius * 2);
          ctx.restore();
          onImageLoaded(); 
        };
      } else {
        ctx.save(); 
        ctx.beginPath();
        ctx.arc(cX, cY, radius, 0, Math.PI * 2);
        ctx.fillStyle = primaryColor;
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = `${radius * 0.8}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(getGlyphSymbol(), cX, cY + (selectedGlyph === 'bot' ? 1 : 0));
        ctx.restore(); 
        onImageLoaded();
      }
    };

    const renderAll = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      if (renderMode === 'minimized') {
        const pY = height / 2 - 25;

        if (launcherType === 'icon') {
          drawLauncherIcon(width / 2, height / 2, 24, () => {});
        } else {
          ctx.font = '600 11px Inter, sans-serif';
          
          // 🛑 DEFINE MAXIMUM FOOTPRINT BOUNDS
          const maxPillWidth = 260; 
          const leftPaddingAndIconSpace = 56; 
          const rightPadding = 20;
          const maxTextWidth = maxPillWidth - (leftPaddingAndIconSpace + rightPadding);

          // ✅ TRANSLATE TEXT WITH CLAMPED STRATEGY
          const processedText = getTruncatedText(launcherText, maxTextWidth);
          const computedTextWidth = ctx.measureText(processedText).width;

          // ✅ COMPUTE AUTOMATIC PILL WIDTH DYNAMICALLY
          const pW = computedTextWidth + leftPaddingAndIconSpace + rightPadding;
          const pX = width / 2 - pW / 2;

          // Render main glass wrapper container
          drawRoundedRect(pX, pY, pW, 50, 25, `${primaryColor}EE`);
          
          // Draw launcher bubble identity graphics inside the calculated layout frame
          drawLauncherIcon(pX + 26, pY + 25, 14, () => {
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.font = '600 11px Inter, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(processedText, pX + 48, pY + 26); 
            ctx.restore();
          });
        }
      } else {
        // ================= EXPANDED CANVAS INTERFACE CONSOLE =================
        drawRoundedRect(0, 0, width, height, borderRadius, `${surfaceColor}CC`, 'rgba(255,255,255,0.08)');

        const headerGrad = ctx.createLinearGradient(0, 0, width, 0);
        headerGrad.addColorStop(0, `${primaryColor}25`);
        headerGrad.addColorStop(1, `${secondaryColor}25`);
        drawRoundedRect(0, 0, width, 52, borderRadius, headerGrad as any);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText(agentName, 44, 31);

        ctx.fillStyle = '#ccc3d8';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillText(backboneModel.toUpperCase(), width - 100, 31);

        drawLauncherIcon(24, 27, 10, () => {});

        drawRoundedRect(16, 76, width - 48, 66, 12, 'rgba(255,255,255,0.03)');
        ctx.fillStyle = '#ccc3d8';
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText("System coordinates connected cleanly. Input vectors", 28, 98);
        ctx.fillText("synchronized. Awaiting training prompt data streams...", 28, 118);

        const inputY = height - 52;
        drawRoundedRect(16, inputY + 12, width - 72, 28, 14, 'rgba(0,0,0,0.25)', 'rgba(255,255,255,0.05)');
        ctx.fillStyle = '#4a4455';
        ctx.fillText("Ask your AI workforce...", 28, inputY + 30);

        const sCX = width - 32; const sCY = inputY + 26;
        ctx.beginPath(); ctx.arc(sCX, sCY, 14, 0, Math.PI * 2);
        ctx.fillStyle = primaryColor; ctx.fill();
        ctx.beginPath(); ctx.moveTo(sCX - 3, sCY + 1); ctx.lineTo(sCX + 3, sCY - 3); ctx.lineTo(sCX + 1, sCY + 4);
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.stroke();
      }
    };

    renderAll();
  }, [agentName, backboneModel, primaryColor, secondaryColor, surfaceColor, borderRadius, isThinking, renderMode, launcherType, logoSource, selectedGlyph, customLogoUrl, launcherText]);

  return (
    <div className="relative w-[340px] h-[420px] select-none pointer-events-none mx-auto flex items-center justify-center">
      <div className="absolute inset-8 rounded-xl blur-3xl opacity-10 transition-colors duration-500" style={{ backgroundColor: primaryColor }} />
      <canvas ref={canvasRef} className="relative z-10 block transition-all duration-300 drop-shadow-4xl" />
    </div>
  );
}