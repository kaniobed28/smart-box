import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { useTheme, useMediaQuery } from '@mui/material';
import ChallengesList from './ChallengesList';
import ChallengeForm from './ChallengeForm';
import DifficultyTabs from './DifficultyTabs';
import Typography from '@mui/material/Typography';

function Challenges({ currentScore, difficulty, startGame, setDifficulty, user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState('all');

  // Fetch challenges from Firestore
  useEffect(() => {
    const q = query(collection(db, 'challenges'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const challengesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        completedBy: doc.data().completedBy || [],
      }));
      setChallenges(
        challengesData.filter((challenge) => {
          const expiresAt =
            new Date(challenge.timestamp).getTime() + 24 * 60 * 60 * 1000; // 24 hours
          return expiresAt > Date.now(); // Only show non-expired challenges
        })
      );
    });
    return () => unsubscribe();
  }, []);

  // Filter challenges based on difficulty
  const filteredChallenges =
    filter === 'all'
      ? challenges
      : challenges.filter((challenge) => challenge.difficulty === filter);

  // Function to throw a new challenge
  const throwChallenge = async (challengeMessage) => {
    if (!auth.currentUser || !currentScore) return;
    try {
      await addDoc(collection(db, 'challenges'), {
        challengerId: auth.currentUser.uid,
        challengerName: auth.currentUser.displayName,
        challengerPhoto: auth.currentUser.photoURL || '',
        scoreToBeat: currentScore,
        difficulty,
        message: challengeMessage || 'Beat my score!',
        timestamp: new Date().toISOString(),
        completedBy: [],
      });
      alert('Challenge thrown to players worldwide!');
    } catch (error) {
      console.error('Error throwing challenge:', error);
      alert('Failed to throw challenge: ' + error.message);
    }
  };

  // Function to accept a challenge
  const acceptChallenge = async (challenge) => {
    if (!auth.currentUser) {
      alert('You must be logged in to accept a challenge.');
      return;
    }
  
    const { uid, displayName, photoURL } = auth.currentUser;
  
    // Check if the user is already a participant
    const isAlreadyParticipant = challenge.completedBy.some(
      (participant) => participant.userId === uid
    );
  
    if (isAlreadyParticipant) {
      alert('You have already accepted this challenge.');
      return;
    }
  
    try {
      const challengeRef = doc(db, 'challenges', challenge.id);
  
      // Add the user as a participant with initial score of 0
      await updateDoc(challengeRef, {
        completedBy: [
          ...challenge.completedBy,
          {
            userId: uid,
            userName: displayName || 'Anonymous',
            userPhoto: photoURL || '',
            score: 0, // Initial score is 0 until they complete the challenge
          },
        ],
      });
  
      // Start the game with the challenge's difficulty
      setDifficulty(challenge.difficulty);
      startGame({
        difficulty: challenge.difficulty,
        timeLimit: challenge.timeLimit || null, // Optional: Pass time limit if applicable
      });
  
      alert(`You have accepted the challenge from ${challenge.challengerName}!`);
    } catch (error) {
      console.error('Error accepting challenge:', error);
      alert('Failed to accept challenge: ' + error.message);
    }
  };

  // Function to mark a challenge as completed
  const markChallengeCompleted = async (challengeId, scoreToBeat) => {
    if (!user || !currentScore) return;
  
    const challengeRef = doc(db, 'challenges', challengeId);
    const challenge = challenges.find((c) => c.id === challengeId);
  
    // Find the participant's index in the completedBy array
    const participantIndex = challenge.completedBy.findIndex(
      (participant) => participant.userId === user.uid
    );
  
    if (participantIndex === -1) {
      alert('You must first accept the challenge to complete it.');
      return;
    }
  
    // Update the participant's score if they beat the challenge
    if (currentScore > scoreToBeat) {
      try {
        const updatedParticipants = [...challenge.completedBy];
        updatedParticipants[participantIndex].score = currentScore; // Replace the initial 0 with the new score
  
        await updateDoc(challengeRef, {
          completedBy: updatedParticipants,
        });
  
        alert(`Challenge beaten! You scored ${currentScore} against ${scoreToBeat}.`);
      } catch (error) {
        console.error('Error marking challenge as completed:', error);
        alert('Failed to update your score. Try again.');
      }
    } else {
      alert(`You didn't beat the challenge score (${scoreToBeat}).`);
    }
  };

  return (
    <div>
      {/* Title */}
      <Typography
        variant="h6"
        color="primary"
        gutterBottom
        sx={{
          fontSize: isMobile ? '1rem' : '1.25rem',
          textAlign: 'center',
        }}
      >
        Global Challenges
      </Typography>

      {/* Challenge Form */}
      <ChallengeForm
        currentScore={currentScore}
        difficulty={difficulty}
        throwChallenge={throwChallenge}
      />

      {/* Difficulty Tabs */}
      <DifficultyTabs filter={filter} setFilter={setFilter} isMobile={isMobile} />

      {/* Challenges List */}
      <ChallengesList
        challenges={filteredChallenges}
        acceptChallenge={acceptChallenge}
        markChallengeCompleted={markChallengeCompleted}
        user={user}
        currentScore={currentScore}
        isMobile={isMobile}
      />
    </div>
  );
}

export default Challenges;