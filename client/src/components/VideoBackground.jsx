import { useEffect, useRef } from 'react';

const VideoBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Flowing gradient blobs
    class FlowingBlob {
      constructor(index) {
        this.index = index;
        this.baseX = Math.random() * canvas.width;
        this.baseY = Math.random() * canvas.height;
        this.size = Math.random() * 400 + 300;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        
        // Theme colors
        const colorSets = [
          { r: 139, g: 92, b: 246, a: 0.15 },   // purple
          { r: 217, g: 70, b: 239, a: 0.12 },   // pink
          { r: 251, g: 191, b: 36, a: 0.1 },    // amber
          { r: 192, g: 132, b: 252, a: 0.13 },  // light purple
          { r: 244, g: 114, b: 182, a: 0.11 },  // light pink
          { r: 167, g: 139, b: 250, a: 0.14 }   // lavender
        ];
        this.color = colorSets[index % colorSets.length];
      }

      update(time) {
        // Organic flowing movement
        this.x = this.baseX + Math.sin(time * 0.0005 + this.index) * 150;
        this.y = this.baseY + Math.cos(time * 0.0003 + this.index) * 150;
        
        // Slowly drift
        this.baseX += this.speedX;
        this.baseY += this.speedY;

        // Wrap around screen
        if (this.baseX < -this.size) this.baseX = canvas.width + this.size;
        if (this.baseX > canvas.width + this.size) this.baseX = -this.size;
        if (this.baseY < -this.size) this.baseY = canvas.height + this.size;
        if (this.baseY > canvas.height + this.size) this.baseY = -this.size;

        // Pulsing size
        this.currentSize = this.size + Math.sin(time * 0.001 + this.index) * 50;
      }

      draw() {
        // Create large soft gradient blob
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.currentSize
        );

        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`);
        gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Mesh gradient effect
    class MeshPoint {
      constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.offsetX = 0;
        this.offsetY = 0;
      }

      update(time) {
        this.offsetX = Math.sin(time * 0.0003 + this.baseX * 0.01) * 60;
        this.offsetY = Math.cos(time * 0.0004 + this.baseY * 0.01) * 60;
        this.x = this.baseX + this.offsetX;
        this.y = this.baseY + this.offsetY;
      }
    }

    // Create flowing blobs
    const blobs = [];
    const blobCount = window.innerWidth < 768 ? 4 : 6;
    for (let i = 0; i < blobCount; i++) {
      blobs.push(new FlowingBlob(i));
    }

    // Create mesh points
    const meshPoints = [];
    const meshCols = 8;
    const meshRows = 6;
    for (let row = 0; row < meshRows; row++) {
      for (let col = 0; col < meshCols; col++) {
        const x = (canvas.width / (meshCols - 1)) * col;
        const y = (canvas.height / (meshRows - 1)) * row;
        meshPoints.push(new MeshPoint(x, y));
      }
    }

    // Draw flowing mesh gradient
    const drawMesh = (time) => {
      meshPoints.forEach(point => point.update(time));

      // Create mesh gradient across points
      for (let row = 0; row < meshRows - 1; row++) {
        for (let col = 0; col < meshCols - 1; col++) {
          const i = row * meshCols + col;
          const p1 = meshPoints[i];
          const p2 = meshPoints[i + 1];
          const p3 = meshPoints[i + meshCols + 1];
          const p4 = meshPoints[i + meshCols];

          // Alternating colors for mesh
          const colors = [
            'rgba(250, 245, 255, 0.03)',
            'rgba(253, 244, 255, 0.03)',
            'rgba(254, 243, 199, 0.02)',
            'rgba(252, 231, 243, 0.03)'
          ];
          
          const colorIndex = (row + col) % colors.length;
          ctx.fillStyle = colors[colorIndex];
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();
          ctx.fill();
        }
      }
    };

    // Animation loop
    const animate = () => {
      time++;

      // Base gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, '#faf5ff');
      bgGradient.addColorStop(0.33, '#fdf4ff');
      bgGradient.addColorStop(0.66, '#fef3c7');
      bgGradient.addColorStop(1, '#fce7f3');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw animated mesh
      drawMesh(time);

      // Draw and update blobs
      blobs.forEach(blob => {
        blob.update(time);
        blob.draw();
      });

      // Add subtle noise texture overlay
      if (time % 3 === 0) {
        ctx.fillStyle = `rgba(${Math.random() * 50 + 100}, ${Math.random() * 50 + 100}, ${Math.random() * 50 + 150}, 0.005)`;
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          ctx.fillRect(x, y, 2, 2);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Canvas Animation Layer */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      
      {/* Optional: Video Background Layer (if you have a video file) */}
      {/* Uncomment and add your video URL below */}
      {/* 
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover pointer-events-none opacity-20"
        style={{ zIndex: 0 }}
      >
        <source src="/path-to-your-video.mp4" type="video/mp4" />
      </video>
      */}
    </>
  );
};

export default VideoBackground;
