import React from 'react';
import Logo from '../../../components/ui/Logo';

const WelcomeHeader = () => {
  return (
    <div className="text-center mb-12">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Logo size="xl" showText={true} />
      </div>

      {/* Welcome Text */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
          Start Your Study Journey
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Connect with friends, track your progress, and achieve your academic goals together
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <div className="constellation-dot active" />
        <div className="constellation-dot" />
        <div className="constellation-dot" />
      </div>
    </div>
  );
};

export default WelcomeHeader;