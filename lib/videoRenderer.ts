import { Product, VideoTemplate } from "@/types";

export type RenderProgress = { phase: string; progress: number };

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 1280;
const FPS = 30;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function ease(t: number) {
  // easeOutCubic
  return 1 - Math.pow(1 - t, 3);
}

function drawBackground(ctx: CanvasRenderingContext2D, t: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  grad.addColorStop(0, "#0A0A0A");
  grad.addColorStop(1, "#1B1A18");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Subtle drifting gold glow, purely decorative, cheap to draw.
  const glowX = CANVAS_WIDTH / 2 + Math.sin(t * 0.5) * 120;
  const glowY = CANVAS_HEIGHT * 0.35;
  const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 500);
  glow.addColorStop(0, "rgba(201,165,106,0.16)");
  glow.addColorStop(1, "rgba(201,165,106,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  const lines: string[] = [];
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
  return lines.length;
}

function drawGoldDivider(ctx: CanvasRenderingContext2D, y: number, width: number) {
  const grad = ctx.createLinearGradient(CANVAS_WIDTH / 2 - width / 2, 0, CANVAS_WIDTH / 2 + width / 2, 0);
  grad.addColorStop(0, "rgba(201,165,106,0)");
  grad.addColorStop(0.5, "rgba(201,165,106,0.9)");
  grad.addColorStop(1, "rgba(201,165,106,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(CANVAS_WIDTH / 2 - width / 2, y, width, 2);
}

type Scene = {
  start: number;
  end: number;
  draw: (ctx: CanvasRenderingContext2D, localT: number, localProgress: number) => void;
};

function buildScenes(
  product: Product,
  template: VideoTemplate,
  productImg: HTMLImageElement,
  personalImg: HTMLImageElement | null
): Scene[] {
  const duration = template.durationSeconds;
  const hookEnd = duration * 0.22;
  const macroEnd = duration * (personalImg ? 0.55 : 0.75);
  const lifestyleEnd = personalImg ? duration * 0.85 : macroEnd;
  const endCardStart = lifestyleEnd;

  const scenes: Scene[] = [
    {
      // Scene 1: Hook
      start: 0,
      end: hookEnd,
      draw: (ctx, t, progress) => {
        drawBackground(ctx, t);
        const fadeIn = Math.min(1, progress / 0.25);
        const fadeOut = Math.min(1, (1 - progress) / 0.15);
        const alpha = Math.min(fadeIn, fadeOut);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#C9A56A";
        ctx.font = "600 28px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText("SANWARNA", CANVAS_WIDTH / 2, 160);
        drawGoldDivider(ctx, 185, 120);

        ctx.fillStyle = "#F3EFE7";
        ctx.font = "500 52px Georgia, serif";
        wrapText(ctx, template.hookText, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 560, 62);
        ctx.restore();
      },
    },
    {
      // Scene 2: Macro product reveal with Ken Burns zoom
      start: hookEnd,
      end: macroEnd,
      draw: (ctx, t, progress) => {
        drawBackground(ctx, t);
        const zoom = 1 + ease(progress) * 0.18;
        const w = CANVAS_WIDTH * 0.72 * zoom;
        const h = w * (productImg.naturalHeight / productImg.naturalWidth);
        const cx = CANVAS_WIDTH / 2 + Math.sin(progress * Math.PI) * 10;
        const cy = CANVAS_HEIGHT * 0.42;

        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 60;
        ctx.drawImage(productImg, cx - w / 2, cy - h / 2, w, h);
        ctx.restore();

        const fadeIn = Math.min(1, progress / 0.15);
        ctx.save();
        ctx.globalAlpha = fadeIn;
        ctx.fillStyle = "#F3EFE7";
        ctx.font = "500 34px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText(product.name, CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.72);
        ctx.fillStyle = "#C9A56A";
        ctx.font = "400 22px Georgia, serif";
        ctx.fillText(`$${product.price}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.72 + 40);
        ctx.restore();
      },
    },
  ];

  if (personalImg) {
    scenes.push({
      start: macroEnd,
      end: lifestyleEnd,
      draw: (ctx, t, progress) => {
        // Cover-fit the personal photo, slow pan.
        const imgRatio = personalImg.naturalWidth / personalImg.naturalHeight;
        const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
        let dw, dh, dx, dy;
        if (imgRatio > canvasRatio) {
          dh = CANVAS_HEIGHT;
          dw = dh * imgRatio;
          dx = -((dw - CANVAS_WIDTH) / 2) - Math.sin(progress * Math.PI) * 12;
          dy = 0;
        } else {
          dw = CANVAS_WIDTH;
          dh = dw / imgRatio;
          dx = 0;
          dy = -((dh - CANVAS_HEIGHT) / 2);
        }
        ctx.drawImage(personalImg, dx, dy, dw, dh);

        const overlay = ctx.createLinearGradient(0, CANVAS_HEIGHT * 0.65, 0, CANVAS_HEIGHT);
        overlay.addColorStop(0, "rgba(10,10,10,0)");
        overlay.addColorStop(1, "rgba(10,10,10,0.85)");
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const fadeIn = Math.min(1, progress / 0.2);
        ctx.save();
        ctx.globalAlpha = fadeIn;
        ctx.fillStyle = "#C9A56A";
        ctx.font = "500 24px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText("As worn", CANVAS_WIDTH / 2, CANVAS_HEIGHT - 90);
        ctx.restore();
      },
    });
  }

  scenes.push({
    start: endCardStart,
    end: duration,
    draw: (ctx, t, progress) => {
      drawBackground(ctx, t);
      const fadeIn = Math.min(1, progress / 0.3);
      ctx.save();
      ctx.globalAlpha = fadeIn;
      ctx.textAlign = "center";
      ctx.fillStyle = "#F3EFE7";
      ctx.font = "500 40px Georgia, serif";
      wrapText(ctx, template.captionText, CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.42, 540, 48);

      drawGoldDivider(ctx, CANVAS_HEIGHT * 0.5, 140);

      ctx.fillStyle = "#C9A56A";
      ctx.font = "600 28px Georgia, serif";
      ctx.fillText(template.ctaText, CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.58);

      ctx.fillStyle = "rgba(243,239,231,0.55)";
      ctx.font = "400 20px Georgia, serif";
      ctx.fillText("SANWARNA.com", CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.88);
      ctx.restore();
    },
  });

  return scenes;
}

export async function renderVideo(
  product: Product,
  template: VideoTemplate,
  personalPhotoDataUrl: string | null,
  onProgress: (p: RenderProgress) => void
): Promise<Blob> {
  onProgress({ phase: "Loading assets", progress: 0.05 });

  const [productImg, personalImg] = await Promise.all([
    loadImage(product.overlayImage),
    personalPhotoDataUrl ? loadImage(personalPhotoDataUrl) : Promise.resolve(null),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const maybeCtx = canvas.getContext("2d");
  if (!maybeCtx) throw new Error("Canvas 2D context unavailable in this browser.");
  const ctx: CanvasRenderingContext2D = maybeCtx;

  const scenes = buildScenes(product, template, productImg, personalImg);
  const duration = template.durationSeconds;

  const stream = canvas.captureStream(FPS);
  const mimeType = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find((t) =>
    MediaRecorder.isTypeSupported(t)
  );
  if (!mimeType) throw new Error("This browser can't record video. Try Chrome, Edge, or Firefox.");

  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4_000_000 });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const donePromise = new Promise<Blob>((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
  });

  onProgress({ phase: "Rolling camera", progress: 0.1 });
  recorder.start();

  const startTime = performance.now();

  await new Promise<void>((resolve) => {
    function frame() {
      const elapsed = (performance.now() - startTime) / 1000;
      const t = Math.min(elapsed, duration);

      const scene = scenes.find((s) => t >= s.start && t <= s.end) ?? scenes[scenes.length - 1];
      const localProgress = Math.min(1, Math.max(0, (t - scene.start) / (scene.end - scene.start || 1)));
      scene.draw(ctx, t, localProgress);

      onProgress({ phase: "Rendering scenes", progress: 0.1 + (t / duration) * 0.8 });

      if (elapsed < duration) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    }
    requestAnimationFrame(frame);
  });

  onProgress({ phase: "Finalizing file", progress: 0.95 });
  recorder.stop();
  stream.getTracks().forEach((tr) => tr.stop());

  const blob = await donePromise;
  onProgress({ phase: "Done", progress: 1 });
  return blob;
}
