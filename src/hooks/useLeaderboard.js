import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

function useLeaderboard() {
  const [topScores, setTopScores] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scoresData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const highestScoresMap = new Map();
      scoresData.forEach((entry) => {
        const existing = highestScoresMap.get(entry.userName);
        if (!existing || entry.score > existing.score) {
          highestScoresMap.set(entry.userName, entry);
        }
      });

      const filteredTopScores = Array.from(highestScoresMap.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setTopScores(filteredTopScores);
    });
    return () => unsubscribe();
  }, []);

  return { topScores, setTopScores };
}

export default useLeaderboard;