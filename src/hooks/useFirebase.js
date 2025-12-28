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

// Default data for when Firebase isn't configured (local demo mode)
const defaultClaims = {
  'the-meatball-mountain': {
    claimedBy: 'Big Mike',
    claimedAt: Date.now()
  }
};

export function useFirebase() {
  const [claims, setClaims] = useState(defaultClaims);
  const [pantry, setPantry] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!database) {
      // Demo mode - use local storage
      console.log('Firebase not configured - running in demo mode');
      const storedClaims = localStorage.getItem('corcozy-claims');
      const storedPantry = localStorage.getItem('corcozy-pantry');

      if (storedClaims) {
        setClaims(JSON.parse(storedClaims));
      }
      if (storedPantry) {
        setPantry(JSON.parse(storedPantry));
      }
      setIsLoading(false);
      return;
    }

    // Listen to claims
    const claimsRef = ref(database, 'claims');
    const unsubscribeClaims = onValue(claimsRef, (snapshot) => {
      const data = snapshot.val();
      setClaims(data || defaultClaims);
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

    return () => {
      unsubscribeClaims();
      unsubscribePantry();
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

  const claimItem = async (itemId, claimerName) => {
    const claimData = {
      claimedBy: claimerName,
      claimedAt: Date.now()
    };

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

  // Initialize with default claims if empty
  const initializeDefaults = async () => {
    if (database) {
      const claimsRef = ref(database, 'claims');
      const snapshot = await get(claimsRef);
      if (!snapshot.exists()) {
        await set(claimsRef, defaultClaims);
      }
    }
  };

  useEffect(() => {
    if (database && !isLoading) {
      initializeDefaults();
    }
  }, [isLoading]);

  return {
    claims,
    pantry,
    isConnected,
    isLoading,
    isFirebaseConfigured: isFirebaseConfigured(),
    claimItem,
    unclaimItem,
    updatePantry,
    getPantryForUser
  };
}
