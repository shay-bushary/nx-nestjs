import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useHangmanGame } from "../hooks/useHangmanGame";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { HangmanVisual } from "../components/HangmanVisual";
import { WordDisplay } from "../components/WordDisplay";
import { LetterKeyboard } from "../components/LetterKeyboard";
import { AttemptsDisplay } from "../components/AttemptsDisplay";
import { GameOverModal } from "../components/GameOverModal";
import styles from "./SinglePlayerGame.module.css";

export function SinglePlayerGame() {
  const navigate = useNavigate();
  const {
    gameState,
    isLoading,
    isGuessing,
    error,
    startGame,
    makeGuess,
    resetGame,
  } = useHangmanGame();

  useEffect(() => {
    startGame();
  }, [startGame]);

  const handlePlayAgain = () => {
    resetGame();
    startGame();
  };

  const handleReturnToMenu = () => {
    navigate("/hangman");
  };

  const isGameOver = gameState.gameStatus !== "playing";

  // Enable keyboard input when game is active and not guessing
  useKeyboardInput({
    onKeyPress: makeGuess,
    disabled: isGameOver || isLoading || isGuessing,
  });

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button onClick={handlePlayAgain} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  const remainingAttempts = gameState.maxAttempts - gameState.wrongGuesses;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Single Player</h1>

      <div className={styles.gameArea}>
        <HangmanVisual wrongGuesses={gameState.wrongGuesses} />

        {gameState.word && (
          <>
            <WordDisplay
              word={gameState.word}
              revealedLetters={gameState.revealedLetters}
            />

            <AttemptsDisplay
              remaining={remainingAttempts}
              max={gameState.maxAttempts}
            />

            <LetterKeyboard
              usedLetters={gameState.usedLetters}
              correctLetters={gameState.revealedLetters}
              onGuess={makeGuess}
              disabled={isGameOver || isGuessing}
            />

            {isGuessing && (
              <div className={styles.checkingIndicator}>Checking...</div>
            )}
          </>
        )}
      </div>

      <GameOverModal
        isOpen={isGameOver}
        isWin={gameState.gameStatus === "won"}
        word={gameState.word}
        onPlayAgain={handlePlayAgain}
        onReturnToMenu={handleReturnToMenu}
      />
    </div>
  );
}
