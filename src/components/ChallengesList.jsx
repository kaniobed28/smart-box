import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Avatar,
    Chip,
    LinearProgress,
    Typography,
    Box,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function ChallengesList({
    challenges,
    acceptChallenge,
    markChallengeCompleted,
    user,
    currentScore,
    isMobile,
}) {
    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'easy':
                return 'success';
            case 'medium':
                return 'warning';
            case 'hard':
                return 'error';
            default:
                return 'grey';
        }
    };

    const getExpirationProgress = (timestamp) => {
        const createdAt = new Date(timestamp).getTime();
        const expiresAt = createdAt + 24 * 60 * 60 * 1000; // 24 hours
        const now = Date.now();
        return Math.max(0, ((expiresAt - now) / (24 * 60 * 60 * 1000)) * 100);
    };

    return (
        <List sx={{ maxHeight: isMobile ? '300px' : '400px', overflow: 'auto' }}>
            {challenges.map((challenge) => (
                <ListItem key={challenge.id}>
                    <Avatar src={challenge.challengerPhoto} sx={{ mr: 2 }} />
                    <ListItemText
                        primary={
                            <Box>
                                {challenge.challengerName}: "{challenge.message}"
                            </Box>
                        }
                        secondary={
                            <>
                                <Typography variant="body2">Score: {challenge.scoreToBeat}</Typography>
                                <Chip
                                    label={challenge.difficulty}
                                    size="small"
                                    sx={{ bgcolor: getDifficultyColor(challenge.difficulty) }}
                                />
                                <LinearProgress
                                    variant="determinate"
                                    value={getExpirationProgress(challenge.timestamp)}
                                />
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="subtitle2">Participants:</Typography>
                                    {challenge.completedBy.length > 0 ? (
                                        challenge.completedBy.map((participant, index) => (
                                            <Typography
                                                key={index}
                                                variant="body2"
                                                sx={{
                                                    color: participant.score > challenge.scoreToBeat ? 'green' : 'inherit',
                                                    fontWeight: participant.score > challenge.scoreToBeat ? 'bold' : 'normal',
                                                }}
                                            >
                                                {participant.userName}: {participant.score}
                                            </Typography>
                                        ))
                                    ) : (
                                        <Typography variant="body2">No participants yet.</Typography>
                                    )}
                                </Box>
                            </>
                        }
                    />
                    <ListItemSecondaryAction>
                        <IconButton
                            edge="end"
                            aria-label="accept challenge"
                            onClick={() => acceptChallenge(challenge)}
                        >
                            <PlayArrowIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
}

export default ChallengesList;