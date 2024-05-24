import React, { useState, useEffect, useCallback } from "react";
import { Box, Container, IconButton, VStack, Text } from "@chakra-ui/react";
import { FaRocket, FaSpaceShuttle } from "react-icons/fa";
import { Image } from "@chakra-ui/react";

const TIEFighter = () => <Image src="https://images.unsplash.com/photo-1552652893-2aa10a0ab4df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDcxMzJ8MHwxfHNlYXJjaHwxfHxzdGFyd2FycyUyMFRJRSUyMGZpZ2h0ZXJ8ZW58MHx8fHwxNzE2NTYxODMyfDA&ixlib=rb-4.0.3&q=80&w=1080" boxSize="50px" />;

const Player = ({ position }) => <IconButton aria-label="Player" icon={<FaSpaceShuttle />} size="lg" position="absolute" bottom="10px" left={`${position}px`} />;

const Bullet = ({ position }) => <Box position="absolute" bottom={`${position.y}px`} left={`${position.x}px`} width="5px" height="20px" bg="red.500" />;

const Enemy = ({ position }) => (
  <Box position="absolute" top={`${position.y}px`} left={`${position.x}px`}>
    <TIEFighter />
  </Box>
);

const Index = () => {
  const [playerPosition, setPlayerPosition] = useState(200);
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([
    { x: 100, y: 50 },
    { x: 200, y: 50 },
    { x: 300, y: 50 },
  ]);
  const [score, setScore] = useState(0);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        setPlayerPosition((prev) => Math.max(prev - 20, 0));
      } else if (event.key === "ArrowRight") {
        setPlayerPosition((prev) => Math.min(prev + 20, 400));
      } else if (event.key === " ") {
        setBullets((prev) => [...prev, { x: playerPosition + 20, y: 40 }]);
      }
    },
    [playerPosition],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBullets((prev) => prev.map((bullet) => ({ ...bullet, y: bullet.y + 10 })).filter((bullet) => bullet.y < 500));

      setEnemies((prev) => prev.map((enemy) => ({ ...enemy, y: enemy.y + 5 })));

      setEnemies((prevEnemies) => {
        const newEnemies = prevEnemies.filter((enemy) => {
          const hit = bullets.some((bullet) => Math.abs(bullet.x - enemy.x) < 20 && Math.abs(bullet.y - enemy.y) < 20);
          if (hit) setScore((prev) => prev + 1);
          return !hit;
        });
        return newEnemies;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [bullets]);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Space Invaders</Text>
        <Text>Score: {score}</Text>
        <Box position="relative" width="500px" height="500px" bg="gray.800" overflow="hidden">
          <Player position={playerPosition} />
          {bullets.map((bullet, index) => (
            <Bullet key={index} position={bullet} />
          ))}
          {enemies.map((enemy, index) => (
            <Enemy key={index} position={enemy} />
          ))}
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
