/**
 * @file DatabaseService_UserProfiles.js
 * @description Métodos para criação, recuperação e atualização de usuários e perfis,
 * incluindo enriquecimento com dados terapêuticos para suporte a crianças autistas.
 */

// Import necessário (será injetado pelo databaseService principal)
let dbService = null;

export function setDatabaseService(service) {
  dbService = service;
}

/**
 * @method createAnonymousUser
 * @async
 * @description Cria um usuário anônimo para acesso inicial.
 * @returns {Promise<string>} ID do usuário criado.
 * @throws {Error} Se a conexão com a internet estiver indisponível.
 */
export async function createAnonymousUser() {
  const requestKey = 'create_anonymous_user';
  return dbService.deduplicatedRequest(requestKey, async () => {
    if (!navigator.onLine) {
      throw new Error('🚨 Portal Betina: Internet connection required for user creation');
    }
    try {
      return await dbService.withRetry(async () => {
        const authResult = await dbService.authService.createAnonymousUser();
        if (authResult.user) {
          dbService.cache.set(`user_${authResult.userId}`, authResult.user, 3600000);
        }
        dbService.logger.info('🌟 Portal Betina: Created anonymous user', { userId: authResult.userId });
        return authResult.userId;
      }, 'createAnonymousUser');
    } catch (error) {
      dbService.logger.error('🚨 Portal Betina: Failed to create user', { error: error.message });
      throw new Error('Portal Betina requires internet connection. Please check your connection.');
    }
  });
}

/**
 * @method getUser
 * @async
 * @description Recupera dados de um usuário específico.
 * @param {string} userId - ID do usuário.
 * @returns {Promise<Object|null>} Dados do usuário ou null se não encontrado.
 * @throws {Error} Se a conexão com a internet estiver indisponível.
 */
export async function getUser(userId) {
  const userIdStr = String(userId);
  const cacheKey = `user_${userIdStr}`;
  const cached = dbService.cache.get(cacheKey);
  if (cached !== null) {
    return cached;
  }
  if (!navigator.onLine) {
    throw new Error('🚨 Portal Betina: Internet connection required for user retrieval');
  }
  try {
    return await dbService.withRetry(async () => {
      const response = await dbService.authenticatedFetch(
        `${dbService.apiUrl}${dbService.API_CONFIG.ENDPOINTS.users}/${userIdStr}`,
        { method: 'GET', headers: dbService.API_CONFIG.DEFAULT_HEADERS }
      );
      if (!response.ok) {
        if (response.status === 404) {
          dbService.cache.set(cacheKey, null, 300000);
          return null;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const user = await response.json();
      dbService.cache.set(cacheKey, user, 1800000);
      dbService.logger.debug('🌟 Portal Betina: User retrieved', { userId: userIdStr });
      return user;
    }, 'getUser');
  } catch (error) {
    dbService.logger.error('🚨 Portal Betina: Failed to retrieve user', {
      userId: userIdStr,
      error: error.message,
    });
    throw new Error('Unable to retrieve user data. Please check your connection.');
  }
}

/**
 * @method getUserProfiles
 * @async
 * @description Recupera os perfis de um usuário com enriquecimento terapêutico.
 * @param {string} userId - ID do usuário.
 * @returns {Promise<Array>} Lista de perfis enriquecidos.
 * @throws {Error} Se a conexão com a internet estiver indisponível.
 */
export async function getUserProfiles(userId) {
  const userIdStr = String(userId);
  const cacheKey = `${dbService.localStoragePrefix}user_profiles_${userIdStr}`;
  const cached = dbService.cache.get(cacheKey);
  if (cached !== null) {
    return cached;
  }
  if (!navigator.onLine) {
    throw new Error('🚨 Portal Betina: Internet connection required for user profiles');
  }
  try {
    return await dbService.withRetry(async () => {
      const response = await dbService.authenticatedFetch(
        `${dbService.apiUrl}${dbService.API_CONFIG.ENDPOINTS.users}/${userIdStr}${dbService.API_CONFIG.ENDPOINTS.profiles}`,
        { method: 'GET', headers: dbService.API_CONFIG.DEFAULT_HEADERS }
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const profiles = await response.json();
      const enrichedProfiles = profiles.map(profile => enrichProfileWithTherapyData(profile));
      dbService.cache.set(cacheKey, enrichedProfiles, 1800000);
      dbService.setLocalData(cacheKey, enrichedProfiles);
      dbService.logger.info('🌟 Portal Betina: User profiles retrieved', {
        userId: userIdStr,
        profileCount: enrichedProfiles.length,
      });
      return enrichedProfiles;
    }, 'getUserProfiles');
  } catch (error) {
    dbService.logger.error('🚨 Portal Betina: Failed to retrieve user profiles', {
      userId: userIdStr,
      error: error.message,
    });
    throw new Error('Unable to retrieve user profiles. Please check your connection.');
  }
}

/**
 * @method createUserProfile
 * @async
 * @description Cria um novo perfil de usuário com dados terapêuticos.
 * @param {string} userId - ID do usuário.
 * @param {Object} profileData - Dados do perfil.
 * @returns {Promise<Object>} Perfil criado.
 * @throws {Error} Se a conexão com a internet estiver indisponível.
 */
export async function createUserProfile(userId, profileData) {
  const userIdStr = String(userId);
  const cacheKey = `${dbService.localStoragePrefix}user_profiles_${userIdStr}`;
  const enhancedProfileData = {
    ...profileData,
    createdAt: new Date().toISOString(),
    therapyData: generateInitialTherapyData(profileData),
    adaptiveParameters: generateInitialAdaptiveParameters(profileData),
    accessibilityProfile: generateAccessibilityProfile(profileData),
    version: '2.1',
  };
  if (!navigator.onLine) {
    throw new Error('🚨 Portal Betina: Internet connection required for profile creation');
  }
  try {
    return await dbService.withRetry(async () => {
      const response = await dbService.authenticatedFetch(
        `${dbService.apiUrl}${dbService.API_CONFIG.ENDPOINTS.users}/${userIdStr}${dbService.API_CONFIG.ENDPOINTS.profiles}`,
        {
          method: 'POST',
          headers: { ...dbService.API_CONFIG.DEFAULT_HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify(enhancedProfileData),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const newProfile = await response.json();
      dbService.cache.invalidate(cacheKey);
      dbService.logger.info('🌟 Portal Betina: User profile created', {
        userId: userIdStr,
        profileId: newProfile.id,
      });
      return newProfile;
    }, 'createUserProfile');
  } catch (error) {
    dbService.logger.error('🚨 Portal Betina: Failed to create user profile', {
      userId: userIdStr,
      error: error.message,
    });
    throw new Error('Unable to create user profile. Please check your connection.');
  }
}

/**
 * @method updateUserProfile
 * @async
 * @description Atualiza um perfil de usuário existente.
 * @param {string} userId - ID do usuário.
 * @param {string} profileId - ID do perfil.
 * @param {Object} updateData - Dados a serem atualizados.
 * @returns {Promise<Object>} Perfil atualizado.
 * @throws {Error} Se a conexão com a internet estiver indisponível.
 */
export async function updateUserProfile(userId, profileId, updateData) {
  const userIdStr = String(userId);
  const profileIdStr = String(profileId);
  const cacheKey = `${dbService.localStoragePrefix}user_profiles_${userIdStr}`;
  const enhancedUpdateData = {
    ...updateData,
    updatedAt: new Date().toISOString(),
    version: '2.1',
  };
  if (!navigator.onLine) {
    throw new Error('🚨 Portal Betina: Internet connection required for profile updates');
  }
  try {
    return await dbService.withRetry(async () => {
      const response = await dbService.authenticatedFetch(
        `${dbService.apiUrl}${dbService.API_CONFIG.ENDPOINTS.users}/${userIdStr}${dbService.API_CONFIG.ENDPOINTS.profiles}/${profileIdStr}`,
        {
          method: 'PUT',
          headers: { ...dbService.API_CONFIG.DEFAULT_HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify(enhancedUpdateData),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const updatedProfile = await response.json();
      dbService.cache.invalidate(cacheKey);
      dbService.logger.info('🌟 Portal Betina: User profile updated', {
        userId: userIdStr,
        profileId: profileIdStr,
      });
      return updatedProfile;
    }, 'updateUserProfile');
  } catch (error) {
    dbService.logger.error('🚨 Portal Betina: Failed to update user profile', {
      userId: userIdStr,
      profileId: profileIdStr,
      error: error.message,
    });
    throw new Error('Unable to update user profile. Please check your connection.');
  }
}