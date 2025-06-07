import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const BannerContainer = styled(motion.div)`
  background: linear-gradient(135deg, var(--primary-pink), var(--primary-orange));
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  margin: var(--space-xl) 0;
  text-align: center;
  color: white;
  box-shadow: var(--shadow-medium);
`

const BannerTitle = styled.h2`
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-md);
  font-weight: 600;
`

const BannerText = styled.p`
  font-size: var(--font-size-md);
  margin-bottom: var(--space-lg);
  line-height: 1.7;
  opacity: 0.95;
  text-align: justify;
  text-justify: inter-word;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
  letter-spacing: 0.3px;
`

const QRCodeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    gap: var(--space-xl);
  }
`

const QRCodeContainer = styled(motion.div)`
  background: white;
  padding: var(--space-md);
  border-radius: var(--radius-medium);
  box-shadow: var(--shadow-light);
`

const QRCodePlaceholder = styled.div`
  width: 150px;
  height: 150px;
  background: var(--light-gray);
  border-radius: var(--radius-small);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
  text-align: center;
  border: 2px dashed var(--medium-gray);
`

const DonationInfo = styled.div`
  flex: 1;
  max-width: 400px;
`

const DonationTitle = styled.h3`
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-sm);
  font-weight: 600;
`

const DonationText = styled.p`
  font-size: var(--font-size-md);
  line-height: 1.5;
  opacity: 0.9;
  margin-bottom: var(--space-sm);
`

const PixKey = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: var(--space-sm);
  border-radius: var(--radius-small);
  font-family: monospace;
  font-size: var(--font-size-sm);
  margin-top: var(--space-sm);
  word-break: break-all;
`

const HeartIcon = styled(motion.span)`
  display: inline-block;
  font-size: var(--font-size-lg);
  margin: 0 var(--space-xs);
`

function DonationBanner() {
  // Chave PIX exemplo - substitua pela sua chave real
  const pixKey = "portal.betina@exemplo.com"

  return (
    <BannerContainer
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <BannerTitle>
        Ajude a manter este projeto vivo 
        <HeartIcon
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          💖
        </HeartIcon>
      </BannerTitle>        <BannerText>
        Este portal nasceu da história da minha filha Bettina e do desejo de apoiar outras crianças no seu desenvolvimento.
        Oferecemos gratuitamente atividades terapêuticas e educativas para crianças com autismo, TDAH e outras necessidades cognitivas.
        <br />
      </BannerText>

      <QRCodeSection>
        <QRCodeContainer
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <QRCodePlaceholder>
            📱 QR Code PIX
            <br />
            <small>(Será gerado automaticamente)</small>
          </QRCodePlaceholder>
        </QRCodeContainer>

        <DonationInfo>
          <DonationTitle>Como doar:</DonationTitle>
          <DonationText>
            • Escaneie o QR Code com seu banco
            <br />
            • Ou use a chave PIX abaixo
            <br />
            • Qualquer valor é bem-vindo! 🙏
          </DonationText>
          
          <DonationTitle>Chave PIX:</DonationTitle>
          <PixKey>
            {pixKey}
          </PixKey>
          
          <DonationText style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
            <strong>Transparência:</strong> 100% das doações são destinadas ao tratamento da Betina e manutenção do portal.
          </DonationText>
        </DonationInfo>
      </QRCodeSection>
    </BannerContainer>
  )
}

export default DonationBanner
