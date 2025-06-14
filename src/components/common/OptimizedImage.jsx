import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

/**
 * Componente para carregar imagens otimizado com lazy loading e fallback
 * @param {string} src - URL da imagem
 * @param {string} alt - Texto alternativo para acessibilidade
 * @param {string} fallbackSrc - URL da imagem de fallback (opcional)
 * @param {string} className - Classes CSS adicionais
 * @param {Function} onLoad - Callback quando a imagem for carregada
 * @param {Function} onError - Callback quando ocorrer erro no carregamento
 */
const OptimizedImage = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.png',
  className = '',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const imageRef = useRef(null);
  
  // Usar Intersection Observer para lazy loading
  useEffect(() => {
    // Criar observer apenas se o browser suportar
    if (!('IntersectionObserver' in window)) {
      // Fallback para browsers que não suportam
      setImageSrc(src);
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Quando a imagem estiver visível, carregar
          setImageSrc(src);
          observer.disconnect();
        }
      });
    }, {
      rootMargin: '100px', // Carregar 100px antes de entrar na viewport
      threshold: 0.01
    });
    
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }
    
    // Cleanup ao desmontar
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [src]);
  
  const handleLoad = (e) => {
    setIsLoaded(true);
    // Performance improvement: remover o listener após primeiro carregamento
    e.target.onload = null;
    onLoad?.(e);
  };
  
  const handleError = (e) => {
    console.error(`Erro ao carregar imagem: ${src}`);
    setHasError(true);
    // Tentar usar imagem de fallback
    if (src !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
    onError?.(e);
  };
  
  return (
    <ImageContainer className={className} {...props}>
      {imageSrc && (
        <StyledImage
          ref={imageRef}
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          $isLoaded={isLoaded}
          $hasError={hasError}
          loading="lazy"
          decoding="async"
        />
      )}
      
      {!isLoaded && !hasError && (
        <ImagePlaceholder
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 0.3, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
      
      {hasError && src === fallbackSrc && (
        <ImageErrorText>Não foi possível carregar a imagem</ImageErrorText>
      )}
    </ImageContainer>
  );
};

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  opacity: ${props => props.$isLoaded ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const ImagePlaceholder = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--light-gray);
`;

const ImageErrorText = styled.div`
  color: var(--medium-gray);
  font-size: var(--font-size-sm);
  padding: var(--space-md);
  text-align: center;
`;

export default OptimizedImage;
