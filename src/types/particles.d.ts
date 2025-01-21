interface Window {
  particlesJS: (
    elementId: string,
    options: {
      particles: {
        number: {
          value: number;
          density: {
            enable: boolean;
            value_area: number;
          };
        };
        color: {
          value: string;
        };
        shape: {
          type: string;
        };
        opacity: {
          value: number;
          random: boolean;
        };
        size: {
          value: number;
          random: boolean;
        };
        line_linked: {
          enable: boolean;
          distance: number;
          color: string;
          opacity: number;
          width: number;
        };
        move: {
          enable: boolean;
          speed: number;
          direction: string;
          random: boolean;
          straight: boolean;
          out_mode: string;
          bounce: boolean;
        };
      };
      interactivity: {
        detect_on: string;
        events: {
          onhover: {
            enable: boolean;
            mode: string;
          };
          onclick: {
            enable: boolean;
            mode: string;
          };
          resize: boolean;
        };
        modes: {
          grab: {
            distance: number;
            line_linked: {
              opacity: number;
            };
          };
          push: {
            particles_nb: number;
          };
        };
      };
      retina_detect: boolean;
    }
  ) => void;
} 