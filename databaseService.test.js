/**
 * CLOUD NANDROPHIC DATABASE SERVICE - TESTES UNITÁRIOS
 * Testes abrangentes para funcionalidades de autismo therapy optimization
 * Covers: ML algorithms, autism adaptations, security, privacy compliance
 */

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import databaseService from "./portal-betina/parametros/databaseService.js";

// Mock dependencies
jest.mock("./authService.js", () => ({
  authService: {
    createAnonymousUser: jest.fn().mockResolvedValue({
      userId: "test-user-123",
      user: { id: "test-user-123", anonymous: true },
    }),
    isAuthenticated: jest.fn().mockReturnValue(true),
  },
  authenticatedFetch: jest.fn(),
}));

jest.mock("../config/api-config.js", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
  CONFIG: {
    API_URL: "http://localhost:3001",
    environment: "test",
  },
  API_CONFIG: {
    ENDPOINTS: {
      health: "/health",
      users: "/api/users",
      sessions: "/api/sessions",
      adaptiveParameters: "/api/adaptive-parameters",
    },
    DEFAULT_HEADERS: {
      "Content-Type": "application/json",
    },
  },
}));

describe("🌟 Cloud Nandrophic DatabaseService - Autism Therapy Tests", () => {
  let service;

  beforeEach(() => {
    service = databaseService;
    // Reset all mocks
    jest.clearAllMocks();
    global.fetch = jest.fn();
    global.navigator = {
      onLine: true,
      language: "pt-BR",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    };
    global.screen = {
      width: 1920,
      height: 1080,
      colorDepth: 24,
    };
    global.window = {
      matchMedia: jest.fn().mockReturnValue({ matches: false }),
      localStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("🧠 Autism Therapy ML Algorithms", () => {
    describe("calculateConsistency", () => {
      it("should calculate autism-optimized consistency with therapeutic weights", () => {
        const sessionData = {
          accuracy: 0.8,
          timeSpent: 300, // 5 minutes - optimal for autism
          attempts: 5,
        };

        const consistency = service.calculateConsistency(sessionData);

        expect(consistency).toBeGreaterThan(80);
        expect(consistency).toBeLessThanOrEqual(100);
      });

      it("should apply autism-specific modifiers correctly", () => {
        const baseData = {
          accuracy: 0.7,
          timeSpent: 240,
          attempts: 4,
        };

        const withSensoryOverload = {
          ...baseData,
          sensoryOverload: true,
        };

        const withSupport = {
          ...baseData,
          communicationSupport: true,
        };

        const baseConsistency = service.calculateConsistency(baseData);
        const overloadConsistency =
          service.calculateConsistency(withSensoryOverload);
        const supportConsistency = service.calculateConsistency(withSupport);

        expect(overloadConsistency).toBeLessThan(baseConsistency);
        expect(supportConsistency).toBeGreaterThan(baseConsistency);
      });

      it("should handle edge cases and invalid input", () => {
        expect(service.calculateConsistency(null)).toBe(75);
        expect(service.calculateConsistency({})).toBeGreaterThan(0);
        expect(service.calculateConsistency({ accuracy: -1 })).toBeGreaterThan(
          0
        );
      });
    });

    describe("calculateLearningVelocity", () => {
      it("should calculate autism-focused learning velocity", () => {
        const sessionData = {
          timeSpent: 180, // 3 minutes
          correctAnswers: 8,
          accuracy: 0.8,
          difficulty: "MEDIUM",
        };

        const velocity = service.calculateLearningVelocity(sessionData);

        expect(velocity).toBeGreaterThan(0);
        expect(velocity).toBeLessThanOrEqual(100);
      });

      it("should apply autism learning adjustments", () => {
        const baseData = {
          timeSpent: 120,
          correctAnswers: 5,
          accuracy: 0.7,
        };

        const withAutismSupport = {
          ...baseData,
          sensoryFeedbackUsed: true,
          visualCuesEnabled: true,
          repetitionCycles: 2,
        };

        const baseVelocity = service.calculateLearningVelocity(baseData);
        const supportVelocity =
          service.calculateLearningVelocity(withAutismSupport);

        expect(supportVelocity).toBeGreaterThan(baseVelocity);
      });

      it("should handle missing data gracefully", () => {
        expect(service.calculateLearningVelocity(null)).toBe(65);
        expect(service.calculateLearningVelocity({})).toBe(65);
      });
    });

    describe("calculateEngagement", () => {
      it("should measure autism-specific engagement factors", () => {
        const sessionData = {
          timeSpent: 240, // 4 minutes - optimal
          attempts: 8,
          interactions: 12,
          accuracy: 0.75,
          completed: true,
        };

        const engagement = service.calculateEngagement(sessionData);

        expect(engagement).toBeGreaterThan(70);
        expect(engagement).toBeLessThanOrEqual(100);
      });

      it("should reward optimal session duration for autism", () => {
        const shortSession = { timeSpent: 30, accuracy: 0.8, completed: true };
        const optimalSession = {
          timeSpent: 300,
          accuracy: 0.8,
          completed: true,
        };
        const longSession = { timeSpent: 900, accuracy: 0.8, completed: true };

        const shortEngagement = service.calculateEngagement(shortSession);
        const optimalEngagement = service.calculateEngagement(optimalSession);
        const longEngagement = service.calculateEngagement(longSession);

        expect(optimalEngagement).toBeGreaterThan(shortEngagement);
        expect(optimalEngagement).toBeGreaterThan(longEngagement);
      });
    });

    describe("suggestAdaptations", () => {
      it("should suggest autism-focused adaptations", () => {
        const strugglingData = {
          accuracy: 0.3,
          timeSpent: 700, // Over 10 minutes
          attempts: 20,
        };

        const adaptations = service.suggestAdaptations(strugglingData);

        expect(adaptations).toContain("difficulty_reduction");
        expect(adaptations).toContain("visual_cues_increase");
        expect(adaptations).toContain("session_break_suggest");
        expect(adaptations).toContain("hint_system_activate");
      });

      it("should suggest challenge increases for high performers", () => {
        const excellentData = {
          accuracy: 0.95,
          timeSpent: 180,
          attempts: 3,
        };

        const adaptations = service.suggestAdaptations(excellentData);

        expect(adaptations).toContain("difficulty_increase");
        expect(adaptations).toContain("time_challenge_add");
      });

      it("should always include autism-specific optimizations", () => {
        const adaptations = service.suggestAdaptations({});

        expect(adaptations).toContain("sensory_feedback_optimize");
        expect(adaptations).toContain("routine_consistency_maintain");
      });
    });
  });

  describe("🔒 Security and Privacy (LGPD/GDPR Compliance)", () => {
    describe("sanitizeNumericInput", () => {
      it("should sanitize numeric inputs with proper bounds", () => {
        expect(service.sanitizeNumericInput(50, 0, 100)).toBe(50);
        expect(service.sanitizeNumericInput(-10, 0, 100)).toBe(0);
        expect(service.sanitizeNumericInput(150, 0, 100)).toBe(100);
        expect(service.sanitizeNumericInput("invalid", 0, 100, 25)).toBe(25);
        expect(service.sanitizeNumericInput(null, 0, 100, 10)).toBe(10);
      });
    });

    describe("sanitizeInput", () => {
      it("should sanitize string inputs and remove HTML", () => {
        const dirty = '<script>alert("xss")</script>Clean text';
        const sanitized = service.sanitizeInput(dirty, { stripHTML: true });

        expect(sanitized).not.toContain("<script>");
        expect(sanitized).toBe('alert("xss")Clean text');
      });

      it("should enforce character restrictions", () => {
        const input = "Valid123-_.@invalid%chars";
        const sanitized = service.sanitizeInput(input);

        expect(sanitized).not.toContain("%");
        expect(sanitized).toContain("Valid123-_.@");
      });

      it("should enforce length limits", () => {
        const longInput = "a".repeat(2000);
        const sanitized = service.sanitizeInput(longInput, { maxLength: 100 });

        expect(sanitized.length).toBe(100);
      });
    });

    describe("getDeviceFingerprint", () => {
      it("should collect minimal LGPD/GDPR compliant data", () => {
        const fingerprint = service.getDeviceFingerprint();

        expect(fingerprint).toHaveProperty("privacyCompliant", true);
        expect(fingerprint).toHaveProperty("dataMinimized", true);
        expect(fingerprint).toHaveProperty(
          "sessionContext",
          "autism-therapy-portal"
        );

        // Should not contain detailed user agent or precise location
        expect(fingerprint).not.toHaveProperty("userAgent");
        expect(fingerprint).not.toHaveProperty("preciseLqocation");

        // Screen size should be rounded for privacy
        expect(fingerprint.screenSize).toMatch(/^\d+x\d+$/);
      });

      it("should generate session-based technical ID", () => {
        const fp1 = service.getDeviceFingerprint();
        const fp2 = service.getDeviceFingerprint();

        expect(fp1.technicalId).toBeDefined();
        expect(fp2.technicalId).toBeDefined();
        expect(fp1.technicalId).not.toBe(fp2.technicalId); // Should be unique per call
      });
    });
  });

  describe("📊 Adaptive Parameters for Autism Therapy", () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });
    });

    it("should provide autism-optimized parameters for memory game", async () => {
      const params = await service.getAdaptiveParameters("memory-game", "EASY");

      expect(params).toBeDefined();
      expect(params.parameters.autismTherapyMode).toBe(true);
      expect(params.parameters.sensoryFeedback).toBe("enhanced");
      expect(params.parameters.rewardFrequency).toBe("high");
      expect(params.parameters.pairs).toBe(4); // Appropriate for autism
    });

    it("should provide social learning parameters for emotional puzzle", async () => {
      const params = await service.getAdaptiveParameters(
        "emotional-puzzle",
        "EASY"
      );

      expect(params).toBeDefined();
      expect(params.parameters.autismSocialSupport).toBe("maximum");
      expect(params.parameters.emotionalRegulation).toBe("guided");
      expect(params.parameters.socialLearning).toBe("foundational");
    });

    it("should include autism research metadata", async () => {
      const params = await service.getAdaptiveParameters(
        "color-match",
        "MEDIUM"
      );

      expect(params.source).toContain("autism");
      expect(params.parameters.autismSupport).toBeDefined();
      expect(params.parameters.evidenceBasedParameters).toBe(true);
    });

    it("should handle unknown games gracefully", async () => {
      const params = await service.getAdaptiveParameters(
        "unknown-game",
        "EASY"
      );
      expect(params).toBeNull();
    });
  });

  describe("💾 Local Data Management with Compression", () => {
    beforeEach(() => {
      global.localStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      };
    });

    it("should store and retrieve data with compression fallback", () => {
      const testData = { large: "x".repeat(15000) }; // Large data to trigger compression

      service.setLocalData("test-key", testData);

      expect(global.localStorage.setItem).toHaveBeenCalled();

      // Mock retrieval
      const storedData = JSON.stringify({
        data: testData,
        timestamp: Date.now(),
        version: "2.0",
        compressed: false,
      });

      global.localStorage.getItem.mockReturnValue(storedData);

      const retrieved = service.getLocalData("test-key");
      expect(retrieved).toEqual(testData);
    });

    it("should handle data expiration", () => {
      const expiredData = JSON.stringify({
        data: { test: "value" },
        timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days old
        version: "2.0",
      });

      global.localStorage.getItem.mockReturnValue(expiredData);

      const retrieved = service.getLocalData("expired-key", "default");
      expect(retrieved).toBe("default");
      expect(global.localStorage.removeItem).toHaveBeenCalledWith(
        "betina_online_expired-key"
      );
    });
  });

  describe("🔄 Circuit Breaker and Resilience", () => {
    it("should handle API failures gracefully", async () => {
      global.fetch.mockRejectedValue(new Error("Network error"));

      const healthCheck = await service.checkApiHealth();
      expect(healthCheck).toBe(false);
    });

    it("should cache health check results", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      // First call should hit the API
      await service.checkApiHealth();
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second call should use cache
      await service.checkApiHealth();
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("🎯 User Experience Optimization", () => {
    describe("Accessibility Detection", () => {
      it("should detect autism-friendly accessibility needs", () => {
        global.window.matchMedia = jest.fn().mockImplementation((query) => ({
          matches: query.includes("prefers-reduced-motion"),
        }));

        const needs = service.detectAccessibilityNeeds();

        expect(needs).toHaveProperty("reducedMotionPreferred");
        expect(needs).toHaveProperty("touchCapable");
        expect(needs).toHaveProperty("keyboardNavigation");
      });

      it("should provide device-specific adaptations", () => {
        global.screen = { width: 768, height: 1024 }; // Tablet size
        global.window.devicePixelRatio = 2;

        const adaptations = service.getDeviceAdaptations();

        expect(adaptations.screenSize).toBe("tablet");
        expect(adaptations.highDPI).toBe(true);
        expect(adaptations.recommendations).toContain("high_dpi_assets");
      });
    });
  });

  describe("🚀 Performance and Caching", () => {
    it("should implement intelligent caching with TTL", () => {
      const cache = service.cache;

      cache.set("test-key", "test-value", 1000); // 1 second TTL
      expect(cache.get("test-key")).toBe("test-value");

      // Simulate time passage
      jest.advanceTimersByTime(1500);
      expect(cache.get("test-key")).toBeNull();
    });

    it("should track cache statistics", () => {
      const cache = service.cache;

      cache.get("non-existent"); // Miss
      cache.set("key1", "value1");
      cache.get("key1"); // Hit

      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe("50.00%");
    });
  });

  describe("🌐 Network State Management", () => {
    it("should enforce online-only mode for autism therapy", () => {
      global.navigator.onLine = false;

      expect(() => {
        service.strategy.enforceOnlineMode();
      }).not.toThrow(); // Should handle gracefully

      expect(service.strategy.shouldUseAPI()).toBe(true); // Always online mode
    });

    it("should handle connection loss with user-friendly messaging", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      service.strategy.handleConnectionLoss();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("🏥 Health Monitoring and Diagnostics", () => {
    it("should calculate comprehensive health score", () => {
      const healthData = {
        circuitBreaker: { state: "CLOSED" },
        cache: { hitRate: "75.50%" },
        strategy: { isOnline: true },
        performance: { requestQueue: 3 },
      };

      const score = service.calculateHealthScore(healthData);
      expect(score).toBeGreaterThan(80);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should provide actionable health recommendations", () => {
      const unhealthyData = {
        circuitBreaker: { state: "OPEN" },
        cache: { hitRate: "25.00%" },
        performance: { requestQueue: 15 },
      };

      const recommendations =
        service.generateHealthRecommendations(unhealthyData);

      expect(recommendations).toContain(
        "API circuit breaker is open - check connectivity"
      );
      expect(recommendations).toContain(
        "High request queue - consider reducing API calls"
      );
      expect(recommendations).toContain(
        "Low cache hit rate - review caching strategy"
      );
    });
  });

  describe("🔧 Utility Functions", () => {
    it("should generate unique session IDs", () => {
      const id1 = service.generateSessionId();
      const id2 = service.generateSessionId();

      expect(id1).toMatch(/^session_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^session_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it("should estimate cognitive load accurately", () => {
      const highLoadSession = {
        accuracy: 0.3,
        timeSpent: 600,
        expectedTime: 300,
        attempts: 15,
        correctAnswers: 5,
      };

      const load = service.estimateCognitiveLoad(highLoadSession);
      expect(load).toBeGreaterThan(70);
      expect(load).toBeLessThanOrEqual(100);
    });
  });

  describe("🧪 Integration Tests", () => {
    it("should handle complete session workflow", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: "session-123", success: true }),
      });

      const sessionData = {
        userId: "user-123",
        gameId: "memory-game",
        accuracy: 0.8,
        timeSpent: 240,
        attempts: 6,
        completed: true,
      };

      const result = await service.saveGameSession(sessionData);

      expect(result).toBeDefined();
      expect(result.id).toBe("session-123");

      // Verify enhanced data was added
      const callArgs = global.fetch.mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      expect(requestBody).toHaveProperty("deviceInfo");
      expect(requestBody).toHaveProperty("cognitiveLoad");
      expect(requestBody).toHaveProperty("adaptiveMetrics");
      expect(requestBody.adaptiveMetrics).toHaveProperty(
        "performanceConsistency"
      );
      expect(requestBody.adaptiveMetrics).toHaveProperty("learningVelocity");
      expect(requestBody.adaptiveMetrics).toHaveProperty("engagementLevel");
    });
  });

  describe("🎨 Autism-Specific Game Parameters", () => {
    it("should provide sensory-friendly creative painting parameters", async () => {
      const params = await service.getAdaptiveParameters(
        "creative-painting",
        "EASY"
      );

      expect(params.parameters.autismFriendly).toBe(true);
      expect(params.parameters.sensoryOverload).toBe("minimal");
      expect(params.parameters.creativeFreedom).toBe("unlimited");
      expect(params.parameters.guidanceLevel).toBe("maximum");
    });

    it("should adapt musical sequence for autism sensory needs", async () => {
      const params = await service.getAdaptiveParameters(
        "musical-sequence",
        "EASY"
      );

      expect(params.parameters.autismCalibration).toBe("sensory-friendly");
      expect(params.parameters.volumeControl).toBe("user-adjustable");
      expect(params.parameters.visualMetronome).toBe(true);
    });

    it("should provide autism-optimized pattern recognition", async () => {
      const params = await service.getAdaptiveParameters(
        "visual-patterns",
        "EASY"
      );

      expect(params.parameters.autismOptimized).toBe(true);
      expect(params.parameters.cognitiveLoad).toBe("low");
      expect(params.parameters.processingTime).toBe("extended");
    });
  });
});

describe("🌟 Cloud Nandrophic Edge Cases and Error Handling", () => {
  let service;

  beforeEach(() => {
    service = databaseService;
    jest.clearAllMocks();
  });

  it("should handle malformed API responses gracefully", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    await expect(service.getUser("test-user")).rejects.toThrow();
  });

  it("should provide fallback data when network fails", async () => {
    global.navigator.onLine = false;

    const params = await service.getAdaptiveParameters("memory-game", "EASY");

    expect(params).toBeDefined();
    expect(params.fallbackMode).toBe("intelligent");
    expect(params.source).toContain("autism_research");
  });

  it("should maintain data consistency across browser sessions", () => {
    const testData = {
      autismProfile: "sensory-sensitive",
      preferences: { animations: false, sounds: "minimal" },
    };

    service.setLocalData("autism-profile", testData);

    // Simulate browser restart by clearing cache
    service.cache.clear();

    global.localStorage.getItem.mockReturnValue(
      JSON.stringify({
        data: testData,
        timestamp: Date.now(),
        version: "2.0",
      })
    );

    const retrieved = service.getLocalData("autism-profile");
    expect(retrieved).toEqual(testData);
  });
});

// Performance benchmarks for autism therapy optimization
describe("⚡ Performance Benchmarks", () => {
  it("should calculate autism metrics within acceptable time limits", () => {
    const largeDataset = {
      accuracy: 0.75,
      timeSpent: 300,
      attempts: 8,
      interactions: Array.from({ length: 100 }, (_, i) => ({
        time: i * 1000,
        correct: i % 2 === 0,
      })),
    };

    const start = performance.now();

    databaseService.calculateConsistency(largeDataset);
    databaseService.calculateLearningVelocity(largeDataset);
    databaseService.calculateEngagement(largeDataset);

    const duration = performance.now() - start;

    expect(duration).toBeLessThan(50); // Should complete within 50ms
  });
});
