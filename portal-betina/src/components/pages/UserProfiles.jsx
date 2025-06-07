import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';

const ProfilesContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  margin: var(--space-lg) 0;
  box-shadow: var(--shadow-medium);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    padding: var(--space-md);
    margin: var(--space-md) var(--space-sm);
  }
  
  @media (max-width: 480px) {
    padding: var(--space-sm);
    margin: var(--space-sm) var(--space-xs);
    border-radius: var(--radius-medium);
  }
  
  .profile-help-text {
    @media (max-width: 480px) {
      font-size: var(--font-size-xs);
    }
  }
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-xl);
  color: var(--primary-purple);
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-md);
  }
  
  @media (max-width: 480px) {
    font-size: var(--font-size-md);
    margin-bottom: var(--space-sm);
  }
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: var(--space-md);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }
`;

const ProfileCard = styled(motion.div)`
  background: white;
  border-radius: var(--radius-medium);
  padding: var(--space-lg);
  box-shadow: var(--shadow-light);
  border-left: 4px solid ${props => props.active ? 'var(--primary-green)' : 'var(--primary-blue)'};
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-medium);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-md);
  }
  
  @media (max-width: 480px) {
    padding: var(--space-sm);
    gap: var(--space-sm);
  }
`;

const ProfileAvatar = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${props => props.color || 'var(--primary-blue)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  margin: 0 auto var(--space-sm);
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 1.7rem;
  }
  
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
`;

const ProfileName = styled.h3`
  font-size: var(--font-size-lg);
  color: var(--primary-blue);
  margin: 0;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-md);
  }
  
  @media (max-width: 480px) {
    font-size: var(--font-size-sm);
  }
`;

const ProfileInfo = styled.p`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
  margin: 0;
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: var(--font-size-xs);
  }
`;

const ActiveBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--primary-green);
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: var(--font-size-xs);
  font-weight: bold;
  
  @media (max-width: 480px) {
    font-size: calc(var(--font-size-xs) * 0.8);
    padding: 2px 6px;
    top: -6px;
    right: -6px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: var(--space-md);
  
  @media (max-width: 480px) {
    margin-bottom: var(--space-sm);
  }
`;

const Label = styled.label`
  display: block;
  font-size: var(--font-size-md);
  color: var(--dark-gray);
  margin-bottom: var(--space-xs);
  
  @media (max-width: 480px) {
    font-size: var(--font-size-sm);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: var(--space-md);
  border: 2px solid var(--light-gray);
  border-radius: var(--radius-medium);
  font-size: var(--font-size-md);
  
  &:focus {
    border-color: var(--primary-blue);
    outline: none;
  }
  
  @media (max-width: 480px) {
    padding: var(--space-sm);
    font-size: var(--font-size-sm);
    border-radius: var(--radius-small);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: var(--space-md);
  border: 2px solid var(--light-gray);
  border-radius: var(--radius-medium);
  font-size: var(--font-size-md);
  
  &:focus {
    border-color: var(--primary-blue);
    outline: none;
  }
  
  @media (max-width: 480px) {
    padding: var(--space-sm);
    font-size: var(--font-size-sm);
    border-radius: var(--radius-small);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-lg);
  flex-wrap: wrap;
  gap: var(--space-sm);
  
  &.profile-buttons {
    margin-top: var(--space-md);
    
    @media (max-width: 768px) {
      gap: var(--space-xs);
    }
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
  
  @media (max-width: 380px) {
    &.profile-buttons {
      flex-direction: row;
    }
  }
`;

const Button = styled(motion.button)`
  padding: var(--space-md) var(--space-lg);
  border: none;
  border-radius: var(--radius-medium);
  font-size: var(--font-size-md);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  
  .button-icon {
    display: inline-flex;
  }
  
  .button-text {
    display: inline-flex;
  }
  
  @media (max-width: 768px) {
    padding: var(--space-sm) var(--space-md);
    font-size: var(--font-size-sm);
  }
  
  @media (max-width: 480px) {
    width: 100%;
    margin-bottom: var(--space-xs);
    padding: var(--space-sm);
    font-size: var(--font-size-sm);
  }
  
  @media (max-width: 380px) {
    .button-text {
      display: none;
    }
  }
  
  &.primary {
    background: var(--primary-blue);
    color: white;
  }
  
  &.secondary {
    background: var(--medium-gray);
    color: white;
  }
  
  &.success {
    background: var(--primary-green);
    color: white;
  }
  
  &.danger {
    background: var(--primary-red);
    color: white;
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: var(--space-xl);
  background: var(--light-gray);
  border-radius: var(--radius-large);
  color: var(--medium-gray);
  font-size: var(--font-size-lg);
  margin: var(--space-xl) 0;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-md);
  overflow-y: auto;
  
  @media (max-width: 480px) {
    padding: var(--space-xs);
    align-items: flex-start;
    padding-top: 50px;
  }
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-large);
  max-height: 90vh;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: var(--space-lg);
    max-width: 90%;
    border-radius: var(--radius-medium);
  }
  
  @media (max-width: 480px) {
    padding: var(--space-md);
    max-width: 100%;
    border-radius: var(--radius-medium);
    max-height: calc(100vh - 60px);
  }
`;

const ModalTitle = styled.h3`
  font-size: var(--font-size-xl);
  color: var(--primary-blue);
  margin-top: 0;
  margin-bottom: var(--space-lg);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-md);
  }
  
  @media (max-width: 480px) {
    font-size: var(--font-size-md);
    margin-bottom: var(--space-sm);
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  margin-top: var(--space-lg);
  
  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: var(--space-sm);
  }
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(6, 1fr);
    gap: var(--space-xs);
  }
`;

const IconOption = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${props => props.selected ? 'var(--primary-blue-light)' : 'var(--light-gray)'};
  border: 2px solid ${props => props.selected ? 'var(--primary-blue)' : 'transparent'};
  
  &:hover {
    background: var(--primary-blue-light);
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 0.9em;
  }
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(6, 1fr);
    gap: var(--space-xs);
  }
`;

const ColorOption = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  background: ${props => props.color};
  border: 3px solid ${props => props.selected ? 'var(--dark-gray)' : 'transparent'};
  
  &:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
  }
`;

const BackButton = styled(motion.button)`
  background: var(--primary-blue);
  color: white;
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  align-self: flex-start;
  margin-bottom: var(--space-lg);
  
  &:hover {
    background: var(--primary-purple);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-sm) var(--space-md);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-md);
  }
  
  @media (max-width: 480px) {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--font-size-xs);
    margin-bottom: var(--space-sm);
  }
`;

const AddProfileIcon = styled.div`
  font-size: 3rem;
  color: var(--primary-blue);
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const AddProfileText = styled.div`
  color: var(--primary-blue);
  font-weight: bold;
  margin-top: 10px;
  text-align: center;
`;

// Opções de avatar e cores
const avatarIcons = ['👧', '👦', '🧒', '👶', '🧑', '👩', '👨', '🐱', '🐶', '🐰', '🦁', '🐼', '🦊', '🐢', '🐬'];
const avatarColors = [
  'var(--primary-blue)', 
  'var(--primary-green)', 
  'var(--primary-orange)', 
  'var(--primary-pink)', 
  'var(--primary-purple)',
  'var(--primary-cyan)',
  '#FF5733', 
  '#33FF57', 
  '#3357FF', 
  '#FF33A8'
];

function UserProfiles({ onBack }) {
  const { 
    userId, 
    isDbConnected, 
    getUserProfiles,
    createUserProfile,
    updateUserProfile,
    deleteUserProfile,
    activateUserProfile,
    getActiveUserProfile
  } = useUser();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    icon: '👧',
    color: 'var(--primary-blue)',
    accessibilityLevel: 'medium'
  });
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  // Carregar perfis
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const userProfiles = await getUserProfiles();
        setProfiles(userProfiles || []);
      } catch (error) {
        console.error('Erro ao carregar perfis:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isDbConnected) {
      fetchProfiles();
    } else {
      setLoading(false);
    }
  }, [getUserProfiles, isDbConnected]);

  // Abrir modal de criação de perfil
  const handleAddProfile = () => {
    setEditingProfile(null);
    setFormData({
      name: '',
      age: '',
      icon: '👧',
      color: 'var(--primary-blue)',
      accessibilityLevel: 'medium'
    });
    setModalOpen(true);
  };
  // Abrir modal para editar perfil existente
  const handleEditProfile = (profile) => {
    setEditingProfile(profile);
    setFormData({
      name: profile.profile_name || '',
      age: profile.age_range ? profile.age_range.split('-')[0] : '',
      icon: profile.profile_icon || '👧',
      color: profile.profile_color || 'var(--primary-blue)',
      accessibilityLevel: profile.preferences?.accessibilityLevel || 'medium'
    });
    setModalOpen(true);
  };

  // Confirmar exclusão de perfil
  const handleConfirmDelete = (profile) => {
    setProfileToDelete(profile);
    setConfirmDeleteModal(true);
  };  // Salvar perfil (novo ou editado)
  const handleSaveProfile = async () => {
    if (!formData.name) {
      alert('Por favor, digite um nome para o perfil.');
      return;
    }

    try {
      const profileData = {
        profile_name: formData.name,
        profile_icon: formData.icon,
        profile_color: formData.color,
        age_range: formData.age ? `${formData.age}-${formData.age}` : null,
        special_needs: [],
        preferences: {
          age: formData.age,
          accessibilityLevel: formData.accessibilityLevel,
          createdAt: new Date().toISOString()
        }
      };

      let result;
      if (editingProfile) {
        // Atualizar perfil existente
        result = await updateUserProfile(editingProfile.id, profileData);
      } else {
        // Criar novo perfil
        result = await createUserProfile(profileData);
      }

      if (result) {
        // Recarregar perfis
        const userProfiles = await getUserProfiles();
        setProfiles(userProfiles || []);
        setModalOpen(false);
      } else {
        alert('Erro ao salvar o perfil. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Ocorreu um erro ao salvar o perfil. Tente novamente.');
    }
  };  // Excluir perfil
  const handleDeleteProfile = async () => {
    if (!profileToDelete) return;

    try {
      await deleteUserProfile(profileToDelete.id);
      
      // Recarregar perfis
      const userProfiles = await getUserProfiles();
      setProfiles(userProfiles || []);
      setConfirmDeleteModal(false);
      setProfileToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir perfil:', error);
      // Mostrar mensagem específica do servidor ou mensagem padrão
      const errorMessage = error.message || 'Ocorreu um erro ao excluir o perfil. Tente novamente.';
      alert(errorMessage);
    }
  };

  // Trocar para outro perfil de usuário
  const handleSwitchProfile = async (profile) => {
    try {
      await activateUserProfile(profile.id);
      // Recarregar perfis para atualizar o status ativo
      const userProfiles = await getUserProfiles();
      setProfiles(userProfiles || []);
    } catch (error) {
      console.error('Erro ao trocar de perfil:', error);
      alert('Ocorreu um erro ao trocar de perfil. Tente novamente.');
    }
  };

  // Atualizar estado do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <ProfilesContainer>
      <BackButton
        onClick={onBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ⬅️ Voltar
      </BackButton>
      
      <SectionTitle>
        <span>👤</span>
        Perfis de Usuário
      </SectionTitle>
      
      {loading ? (
        <div>Carregando perfis...</div>
      ) : !isDbConnected ? (
        <NoDataMessage>
          A funcionalidade de múltiplos perfis requer conexão com o banco de dados.
          <br/>
          <br/>
          Por favor, inicie o portal no modo Docker para usar esta função.
        </NoDataMessage>
      ) : (
        <>          <ProfileGrid>
            {profiles.map(profile => (
              <ProfileCard 
                key={profile.id}
                active={profile.is_active}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSwitchProfile(profile)}
              >
                {profile.is_active && <ActiveBadge>Ativo</ActiveBadge>}
                <ProfileAvatar color={profile.profile_color || 'var(--primary-blue)'}>
                  {profile.profile_icon || '👤'}
                </ProfileAvatar>
                <ProfileName>{profile.profile_name || 'Sem nome'}</ProfileName>
                <ProfileInfo>
                  {profile.age_range || 'Idade não informada'}
                </ProfileInfo>
                <ButtonGroup className="profile-buttons">
                  <Button 
                    className="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProfile(profile);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="button-icon">✏️</span>
                    <span className="button-text">Editar</span>
                  </Button>                  <Button 
                    className="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmDelete(profile);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      cursor: 'pointer'
                    }}
                    title="Excluir perfil"
                  >
                    <span className="button-icon">🗑️</span>
                    <span className="button-text">Excluir</span>
                  </Button>
                </ButtonGroup>
              </ProfileCard>
            ))}              <ProfileCard 
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddProfile}
                style={{ 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: 'auto',
                  minHeight: '200px',
                  padding: '20px'
                }}
              >
                <AddProfileIcon>+</AddProfileIcon>
                <AddProfileText>Adicionar Perfil</AddProfileText>
              </ProfileCard>
          </ProfileGrid>          <div style={{ 
            textAlign: 'center', 
            marginTop: 'var(--space-xl)', 
            color: 'var(--medium-gray)',
            padding: '0 var(--space-md)'
          }}
            className="profile-help-text">
            <p>Os perfis permitem salvar o progresso de múltiplos usuários. Cada perfil terá suas próprias preferências e histórico de atividades.</p>
            <p>Clique em um perfil para ativá-lo ou use os botões para editar e excluir.</p>
          </div>
        </>
      )}
      
      {/* Modal de criação/edição de perfil */}
      <AnimatePresence>
        {modalOpen && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >              <ModalTitle>
                {editingProfile ? `Editar Perfil: ${editingProfile.profile_name}` : 'Novo Perfil'}
              </ModalTitle>
              
              <FormGroup>
                <Label>Nome</Label>
                <Input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Digite o nome"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Idade</Label>
                <Input 
                  type="number" 
                  name="age" 
                  value={formData.age} 
                  onChange={handleInputChange} 
                  placeholder="Digite a idade"
                  min="1" 
                  max="18"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Ícone</Label>
                <IconGrid>
                  {avatarIcons.map((icon, index) => (
                    <IconOption 
                      key={index} 
                      selected={formData.icon === icon}
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    >
                      {icon}
                    </IconOption>
                  ))}
                </IconGrid>
              </FormGroup>
              
              <FormGroup>
                <Label>Cor do Perfil</Label>
                <ColorGrid>
                  {avatarColors.map((color, index) => (
                    <ColorOption 
                      key={index} 
                      color={color}
                      selected={formData.color === color}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    />
                  ))}
                </ColorGrid>
              </FormGroup>
              
              <FormGroup>
                <Label>Nível de Acessibilidade</Label>
                <Select 
                  name="accessibilityLevel" 
                  value={formData.accessibilityLevel} 
                  onChange={handleInputChange}
                >
                  <option value="low">Básico - Poucas adaptações</option>
                  <option value="medium">Médio - Adaptações padrão</option>
                  <option value="high">Alto - Máxima assistência</option>
                </Select>
              </FormGroup>
              
              <ModalButtons>
                <Button 
                  className="secondary"
                  onClick={() => setModalOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancelar
                </Button>
                <Button 
                  className="primary"
                  onClick={handleSaveProfile}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {editingProfile ? 'Salvar Alterações' : 'Criar Perfil'}
                </Button>
              </ModalButtons>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Modal de confirmação de exclusão */}
      <AnimatePresence>
        {confirmDeleteModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmDeleteModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >              <ModalTitle>Confirmar Exclusão</ModalTitle>
              <p>Tem certeza que deseja excluir o perfil "{profileToDelete?.profile_name}"?</p>
              <p>Esta ação não pode ser desfeita.</p>
              
              <ModalButtons>
                <Button 
                  className="secondary"
                  onClick={() => setConfirmDeleteModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancelar
                </Button>
                <Button 
                  className="danger"
                  onClick={handleDeleteProfile}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Excluir Perfil
                </Button>
              </ModalButtons>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </ProfilesContainer>
  );
}

export default UserProfiles;
