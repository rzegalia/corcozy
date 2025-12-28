import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey &&
         firebaseConfig.databaseURL &&
         firebaseConfig.apiKey !== 'your-api-key-here';
};

// Initialize Firebase only if configured
let app = null;
let database = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

// No default claims - start fresh
const defaultClaims = {};

export function useFirebase() {
  const [claims, setClaims] = useState(defaultClaims);
  const [pantry, setPantry] = useState({});
  const [ingredientClaims, setIngredientClaims] = useState({});
  const [equipmentClaims, setEquipmentClaims] = useState({});
  const [currentUser, setCurrentUserState] = useState(() => {
    // Initialize from localStorage
    return localStorage.getItem('corcozy-current-user') || '';
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Persist currentUser to localStorage
  const setCurrentUser = (name) => {
    const trimmedName = name.trim();
    setCurrentUserState(trimmedName);
    if (trimmedName) {
      localStorage.setItem('corcozy-current-user', trimmedName);
      // Also update the last-name for claim modal consistency
      localStorage.setItem('corcozy-last-name', trimmedName);
    } else {
      localStorage.removeItem('corcozy-current-user');
    }
  };

  useEffect(() => {
    if (!database) {
      // Demo mode - use local storage
      console.log('Firebase not configured - running in demo mode');
      const storedClaims = localStorage.getItem('corcozy-claims');
      const storedPantry = localStorage.getItem('corcozy-pantry');
      const storedIngredientClaims = localStorage.getItem('corcozy-ingredient-claims');
      const storedEquipmentClaims = localStorage.getItem('corcozy-equipment-claims');

      if (storedClaims) {
        setClaims(JSON.parse(storedClaims));
      }
      if (storedPantry) {
        setPantry(JSON.parse(storedPantry));
      }
      if (storedIngredientClaims) {
        setIngredientClaims(JSON.parse(storedIngredientClaims));
      }
      if (storedEquipmentClaims) {
        setEquipmentClaims(JSON.parse(storedEquipmentClaims));
      }
      setIsLoading(false);
      return;
    }

    // Listen to claims
    const claimsRef = ref(database, 'claims');
    const unsubscribeClaims = onValue(claimsRef, (snapshot) => {
      const data = snapshot.val();
      setClaims(data || {});
      setIsConnected(true);
      setIsLoading(false);
    }, (error) => {
      console.error('Claims listener error:', error);
      setIsConnected(false);
      setIsLoading(false);
    });

    // Listen to pantry
    const pantryRef = ref(database, 'pantry');
    const unsubscribePantry = onValue(pantryRef, (snapshot) => {
      const data = snapshot.val();
      setPantry(data || {});
    });

    // Listen to ingredient claims
    const ingredientClaimsRef = ref(database, 'ingredientClaims');
    const unsubscribeIngredientClaims = onValue(ingredientClaimsRef, (snapshot) => {
      const data = snapshot.val();
      setIngredientClaims(data || {});
    });

    // Listen to equipment claims
    const equipmentClaimsRef = ref(database, 'equipmentClaims');
    const unsubscribeEquipmentClaims = onValue(equipmentClaimsRef, (snapshot) => {
      const data = snapshot.val();
      setEquipmentClaims(data || {});
    });

    return () => {
      unsubscribeClaims();
      unsubscribePantry();
      unsubscribeIngredientClaims();
      unsubscribeEquipmentClaims();
    };
  }, []);

  // Save to local storage when in demo mode
  useEffect(() => {
    if (!database) {
      localStorage.setItem('corcozy-claims', JSON.stringify(claims));
    }
  }, [claims]);

  useEffect(() => {
    if (!database) {
      localStorage.setItem('corcozy-pantry', JSON.stringify(pantry));
    }
  }, [pantry]);

  useEffect(() => {
    if (!database) {
      localStorage.setItem('corcozy-ingredient-claims', JSON.stringify(ingredientClaims));
    }
  }, [ingredientClaims]);

  useEffect(() => {
    if (!database) {
      localStorage.setItem('corcozy-equipment-claims', JSON.stringify(equipmentClaims));
    }
  }, [equipmentClaims]);

  // Dish claims
  const claimItem = async (itemId, claimerName) => {
    const claimData = {
      claimedBy: claimerName,
      claimedAt: Date.now()
    };

    // Update current user when claiming
    if (claimerName.trim()) {
      setCurrentUser(claimerName);
    }

    if (database) {
      await set(ref(database, `claims/${itemId}`), claimData);
    } else {
      setClaims(prev => ({
        ...prev,
        [itemId]: claimData
      }));
    }
  };

  const unclaimItem = async (itemId) => {
    if (database) {
      await set(ref(database, `claims/${itemId}`), null);
    } else {
      setClaims(prev => {
        const newClaims = { ...prev };
        delete newClaims[itemId];
        return newClaims;
      });
    }
  };

  // Ingredient claims (collaborative shopping)
  const claimIngredient = async (ingredientKey, claimerName) => {
    const normalizedKey = ingredientKey.toLowerCase().trim();
    const claimData = {
      claimedBy: claimerName,
      claimedAt: Date.now()
    };

    if (database) {
      await set(ref(database, `ingredientClaims/${normalizedKey}`), claimData);
    } else {
      setIngredientClaims(prev => ({
        ...prev,
        [normalizedKey]: claimData
      }));
    }
  };

  const unclaimIngredient = async (ingredientKey) => {
    const normalizedKey = ingredientKey.toLowerCase().trim();
    if (database) {
      await set(ref(database, `ingredientClaims/${normalizedKey}`), null);
    } else {
      setIngredientClaims(prev => {
        const newClaims = { ...prev };
        delete newClaims[normalizedKey];
        return newClaims;
      });
    }
  };

  const getIngredientClaim = (ingredientName) => {
    const normalizedKey = ingredientName.toLowerCase().trim();
    return ingredientClaims[normalizedKey] || null;
  };

  // Equipment claims
  const claimEquipment = async (equipmentId, claimerName, note = '') => {
    const claimData = {
      claimedBy: claimerName,
      claimedAt: Date.now(),
      note: note.trim()
    };

    if (database) {
      await set(ref(database, `equipmentClaims/${equipmentId}`), claimData);
    } else {
      setEquipmentClaims(prev => ({
        ...prev,
        [equipmentId]: claimData
      }));
    }
  };

  const unclaimEquipment = async (equipmentId) => {
    if (database) {
      await set(ref(database, `equipmentClaims/${equipmentId}`), null);
    } else {
      setEquipmentClaims(prev => {
        const newClaims = { ...prev };
        delete newClaims[equipmentId];
        return newClaims;
      });
    }
  };

  // Pantry (what you already have)
  const updatePantry = async (userName, ingredients) => {
    if (database) {
      await set(ref(database, `pantry/${userName}`), ingredients);
    } else {
      setPantry(prev => ({
        ...prev,
        [userName]: ingredients
      }));
    }
  };

  const getPantryForUser = (userName) => {
    return pantry[userName] || [];
  };

  return {
    // State
    claims,
    pantry,
    ingredientClaims,
    equipmentClaims,
    currentUser,
    isConnected,
    isLoading,
    isFirebaseConfigured: isFirebaseConfigured(),

    // User identity
    setCurrentUser,

    // Dish claims
    claimItem,
    unclaimItem,

    // Ingredient claims (collaborative shopping)
    claimIngredient,
    unclaimIngredient,
    getIngredientClaim,

    // Equipment claims
    claimEquipment,
    unclaimEquipment,

    // Pantry
    updatePantry,
    getPantryForUser
  };
}
