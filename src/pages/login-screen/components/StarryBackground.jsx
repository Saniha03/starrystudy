import React from 'react';

const StarryBackground = () => {
  // Generate random stars for the background
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    animationDelay: Math.random() * 4
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Cosmic gradient background */}
      <div className="absolute inset-0 cosmic-gradient" />
      {/* Animated stars */}
      {stars?.map((star) => (
        <div
          key={star?.id}
          className="absolute rounded-full bg-white opacity-60 pulse-gentle"
          style={{
            left: `${star?.left}%`,
            top: `${star?.top}%`,
            width: `${star?.size}px`,
            height: `${star?.size}px`,
            animationDelay: `${star?.animationDelay}s`
          }}
        />
      ))}
      {/* Larger accent stars */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-accent rounded-full pulse-gentle" />
      <div className="absolute top-32 right-16 w-1.5 h-1.5 bg-accent rounded-full pulse-gentle" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-20 w-2.5 h-2.5 bg-accent rounded-full pulse-gentle" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 right-10 w-1 h-1 bg-accent rounded-full pulse-gentle" style={{ animationDelay: '3s' }} />
    </div>
  );
};

export default StarryBackground;