import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import GameArea from './GameArea';
import { db } from '../firebase'; // Adjust path to your firebase.js
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';

function Championship({
  user,
  difficulty,
  setDifficulty,
  startGame,
  gameActive,
  timeLeft,
  score,
  highScore,
  boxPosition,
  moveBox,
  playAreaRef,
  topScores,
  setTopScores,
  gameBackgroundImage,
  startChampionship,
  championshipLink,
  setChampionshipLink,
}) {
  const [championshipPlayers, setChampionshipPlayers] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isChampionshipActive, setIsChampionshipActive] = useState(false);
  const [championshipId, setChampionshipId] = useState(null);
  const [readyPlayers, setReadyPlayers] = useState([]);
  const [startTime, setStartTime] = useState(null);

  // Start a new championship (creator only)
  const handleStartChampionship = async () => {
    if (!user) {
      alert('Please log in to start a championship.');
      return;
    }

    const uniqueId = Math.random().toString(36).substring(2, 15); // Temporary; use UUID in production
    const inviteLink = `${window.location.origin}/join-championship/${uniqueId}`;
    const initialPlayers = [{ id: user.uid, name: user.displayName, score: 0 }];

    console.log('Attempting to start championship with user:', user.uid, user.displayName);
    try {
      const champRef = doc(db, 'championships', uniqueId);
      await setDoc(champRef, {
        players: initialPlayers,
        round: 1,
        active: true,
        creator: user.uid,
        readyPlayers: [],
        startTime: null,
        difficulty: difficulty || 'Medium',
      });
      console.log('Championship successfully created with ID:', uniqueId);
      setChampionshipId(uniqueId);
      setChampionshipLink(inviteLink);
      setChampionshipPlayers(initialPlayers);
      setCurrentRound(1);
      setIsChampionshipActive(true);
      startChampionship();
    } catch (error) {
      console.error('Error starting championship:', error);
      alert(`Failed to start championship: ${error.message}. Please try again.`);
    }
  };

  // Sync with Firestore and handle joins (for all users clicking the link)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const joinId = urlParams.get('join');

    if (!joinId) return;

    if (!user) {
      alert('Please log in to join the championship.');
      window.location.href = '/'; // Adjust to your login route
      return;
    }

    console.log('User accessing championship with ID:', joinId, 'as', user.displayName);
    const champRef = doc(db, 'championships', joinId);
    const unsubscribe = onSnapshot(champRef, (snapshot) => {
      const data = snapshot.data();
      if (data && data.active) {
        const players = data.players || [];
        // Add the joining user if not already present
        if (!players.some(p => p.id === user.uid)) {
          const updatedPlayers = [...players, { id: user.uid, name: user.displayName, score: 0 }];
          updateDoc(champRef, { players: updatedPlayers })
            .then(() => console.log(`${user.displayName} joined championship ${joinId}`))
            .catch(error => console.error('Error joining championship:', error));
        }
        setChampionshipId(joinId);
        setChampionshipLink(`${window.location.origin}/join-championship/${joinId}`);
        setChampionshipPlayers(players); // This will update with new players in real-time
        setCurrentRound(data.round || 1);
        setIsChampionshipActive(true);
        setReadyPlayers(data.readyPlayers || []);
        setStartTime(data.startTime || null);
        setDifficulty(data.difficulty || 'Medium');
      } else {
        alert('This championship is either invalid or has ended.');
        setIsChampionshipActive(false);
      }
    }, (error) => {
      console.error('Error fetching championship:', error);
    });
    return () => unsubscribe();
  }, [user, setDifficulty]);

  // Real-time sync for active championship
  useEffect(() => {
    if (!championshipId || !user) return;

    const champRef = doc(db, 'championships', championshipId);
    const unsubscribe = onSnapshot(champRef, (snapshot) => {
      const data = snapshot.data();
      if (data) {
        setChampionshipPlayers(data.players || []);
        setCurrentRound(data.round || 1);
        setIsChampionshipActive(data.active);
        setReadyPlayers(data.readyPlayers || []);
        setStartTime(data.startTime || null);
        setDifficulty(data.difficulty || 'Medium');
        if (!data.active) {
          setChampionshipLink(null);
          setChampionshipId(null);
        }
      }
    }, (error) => {
      console.error('Error syncing championship:', error);
    });
    return () => unsubscribe();
  }, [championshipId, user, setDifficulty]);

  // Handle player marking themselves as ready
  const handlePlayerReady = async () => {
    if (!championshipId || !user || readyPlayers.includes(user.uid)) return;

    const champRef = doc(db, 'championships', championshipId);
    const updatedReadyPlayers = [...readyPlayers, user.uid];
    await updateDoc(champRef, { readyPlayers: updatedReadyPlayers });

    if (updatedReadyPlayers.length === championshipPlayers.length) {
      const startTime = Date.now() + 5000; // Start 5 seconds from now
      await updateDoc(champRef, { startTime });
    }
  };

  // Start game when startTime is reached
  useEffect(() => {
    if (!startTime || gameActive) return;

    const now = Date.now();
    if (startTime <= now) {
      startGame();
    } else {
      const timeout = setTimeout(() => startGame(), startTime - now);
      return () => clearTimeout(timeout);
    }
  }, [startTime, gameActive, startGame]);

  // End a round and eliminate a player
  const handleEndRound = async (playerScores) => {
    if (!championshipId || !user) return;

    const champRef = doc(db, 'championships', championshipId);
    const updatedPlayers = championshipPlayers.map(player => ({
      ...player,
      score: player.id === user.uid ? score : (playerScores[player.id] || player.score),
    }));
    const sortedPlayers = updatedPlayers.sort((a, b) => b.score - a.score);

    try {
      if (sortedPlayers.length > 1) {
        sortedPlayers.pop();
        await updateDoc(champRef, {
          players: sortedPlayers,
          round: currentRound + 1,
          readyPlayers: [],
          startTime: null,
        });
        setChampionshipPlayers(sortedPlayers);
        setCurrentRound(prev => prev + 1);
      } else {
        await updateDoc(champRef, {
          players: sortedPlayers,
          active: false,
        });
        setIsChampionshipActive(false);
        setChampionshipLink(null);
        setChampionshipId(null);
        setTopScores(prev => [...prev, { name: sortedPlayers[0].name, score: sortedPlayers[0].score }]);
        alert(`${sortedPlayers[0].name} is the Champion!`);
      }
    } catch (error) {
      console.error('Error ending round:', error);
      alert('Failed to update championship. Try again.');
    }
  };

  return (
    <Grid container spacing={2} sx={{ height: '100%' }}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          {!isChampionshipActive ? (
            <div>
              <Typography variant="h5">Championship Mode</Typography>
              <Button 
                variant="contained" 
                onClick={handleStartChampionship} 
                disabled={!user}
                sx={{ mt: 2 }}
              >
                Start Championship
              </Button>
              {championshipLink && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Invite others: <a href={`${championshipLink}?join=${championshipId}`}>{championshipLink}</a>
                </Typography>
              )}
            </div>
          ) : (
            <div>
              <Typography variant="h5">Championship Round {currentRound}</Typography>
              <Typography variant="body1">Players Remaining: {championshipPlayers.length}</Typography>
              <Typography variant="body1">Difficulty: {difficulty}</Typography>
              <List>
                {championshipPlayers.map(player => (
                  <ListItem key={player.id}>
                    <ListItemText 
                      primary={`${player.name} - Score: ${player.score} ${readyPlayers.includes(player.id) ? '(Ready)' : ''}`} 
                    />
                  </ListItem>
                ))}
              </List>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Invite others: <a href={`${championshipLink}?join=${championshipId}`}>{championshipLink}</a>
              </Typography>
              {!gameActive && !startTime && (
                <Button 
                  variant="contained" 
                  onClick={handlePlayerReady} 
                  disabled={readyPlayers.includes(user.uid)}
                  sx={{ mb: 2 }}
                >
                  I’m Ready
                </Button>
              )}
              {startTime && !gameActive && (
                <Typography variant="body1">
                  Game starts in {Math.max(0, Math.ceil((startTime - Date.now()) / 1000))} seconds...
                </Typography>
              )}
              <GameArea
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                startGame={startGame}
                gameActive={gameActive}
                timeLeft={timeLeft}
                score={score}
                highScore={highScore}
                boxPosition={boxPosition}
                moveBox={moveBox}
                playAreaRef={playAreaRef}
                topScores={topScores}
                currentScore={score}
                user={user}
                gameBackgroundImage={gameBackgroundImage}
                isChampionshipMode={isChampionshipActive}
                championshipPlayers={championshipPlayers}
                currentRound={currentRound}
                endChampionshipRound={handleEndRound}
                championshipLink={championshipLink}
              />
            </div>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Championship;