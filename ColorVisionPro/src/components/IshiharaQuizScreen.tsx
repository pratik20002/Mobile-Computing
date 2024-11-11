import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

interface Question {
  image: any;
  options: string[];
  correctAnswer: string;
}

const IshiharaQuizScreen = ({ navigation }: any) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions: Question[] = [
    {
      image: require('../../assets/Sample.jpg'), // Update with actual image paths
      options: ['5', '6', '7', '8'],
      correctAnswer: '6',
    },
    {
      image: require('../../assets/Sample.jpg'),
      options: ['12', '15', '8', '9'],
      correctAnswer: '12',
    },
    // Add more questions as needed
  ];

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (answer: string) => {
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(30);
    setQuizCompleted(false);
  };

  const generateReport = async () => {
    // Determine color blindness type based on score
    let colorBlindnessType = '';
    if (score > 8) {
      colorBlindnessType = 'No color blindness detected';
    } else if (score > 5) {
      colorBlindnessType = 'Mild color blindness';
    } else {
      colorBlindnessType = 'Moderate to severe color blindness';
    }

    const htmlContent = `
      <h1>Color Vision Test Report</h1>
      <p><strong>Score:</strong> ${score} / ${questions.length}</p>
      <p><strong>Result:</strong> ${colorBlindnessType}</p>
    `;

    try {
      const options = {
        html: htmlContent,
        fileName: 'ColorVisionReport',
        directory: 'Documents',
      };
      const file = await RNHTMLtoPDF.convert(options);
      return file.filePath;
    } catch (error) {
      Alert.alert('Error', 'Could not generate PDF');
      console.error(error);
    }
  };

  const shareReport = async () => {
    const pdfPath = await generateReport();
    if (pdfPath) {
      const shareOptions = {
        title: 'Share Report',
        url: `file://${pdfPath}`,
        type: 'application/pdf',
      };
      try {
        await Share.open(shareOptions);
      } catch (error) {
        Alert.alert('Error', 'Could not share PDF');
        console.error(error);
      }
    }
  };

  if (quizCompleted) {
    return (
      <View style={styles.container}>
        <Text style={styles.scoreText}>Your Score: {score} / {questions.length}</Text>
        <Text style={styles.resultText}>
          {score > 8 ? 'No color blindness detected' : score > 5 ? 'Mild color blindness' : 'Moderate to severe color blindness'}
        </Text>
        <Button title="Download Report" onPress={shareReport} />
        <Button title="Retake Quiz" onPress={resetQuiz} />
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>Time Left: {timeLeft}s</Text>
      <Image source={currentQuestion.image} style={styles.image} />
      {currentQuestion.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() => handleAnswer(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  timerText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  image: { width: 250, height: 250, marginBottom: 20 },
  optionButton: {
    width: '80%',
    padding: 12,
    backgroundColor: '#E0F7FA',
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  optionText: { fontSize: 18, color: '#00796B' },
  scoreText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  resultText: { fontSize: 20, fontWeight: '600', marginVertical: 10, color: 'green' },
});

export default IshiharaQuizScreen;
