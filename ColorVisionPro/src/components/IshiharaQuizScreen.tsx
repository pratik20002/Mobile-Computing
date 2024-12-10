import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

interface Question {
  image: any;
  options: string[];
  correctAnswer: string;
  colorType: string; // For identifying red-green or blue-yellow mistakes
}

const IshiharaQuizScreen = ({ navigation, route }: any) => {
  const userName = route?.params?.userName || 'Guest';
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [progress] = useState(new Animated.Value(1));
  const [missedColors, setMissedColors] = useState<string[]>([]);

  const allQuestions: Question[] = [
        {
          image: require('../../assets/2.jpg'),
          options: ['2', '8', '12', '4'],
          correctAnswer: '2',
          colorType: 'red-green',
        },
        {
          image: require('../../assets/3.jpg'),
          options: ['8', '9', '3', 'None'],
          correctAnswer: '3',
          colorType: 'red-green',
        },
        {
          image: require('../../assets/default.jpg'),
          options: ['3', '5', '6', '8'],
          correctAnswer: '5',
          colorType: 'red-green',
        },
        {
            image: require('../../assets/6.jpg'),
            options: ['8', '3', '6', 'None'],
            correctAnswer: '6',
            colorType: 'red-green',
        },
        {
            image: require('../../assets/7.jpg'),
            options: ['9', '7', '3', 'None'],
            correctAnswer: '7',
            colorType: 'red-green',
        },
        {
            image: require('../../assets/8.jpg'),
            options: ['3', '7', '8', 'None'],
            correctAnswer: '8',
            colorType: 'red-green',
        },
        {
            image: require('../../assets/12.jpg'),
            options: ['13', '31', '21', '12'],
            correctAnswer: '12',
            colorType: 'red-green',
        },
        {
            image: require('../../assets/15.jpg'),
            options: ['16', '18', '15', '19'],
            correctAnswer: '15',
            colorType: 'yellow-green',
        },
        {
            image: require('../../assets/16.jpg'),
            options: ['16', '19', '18', '21'],
            correctAnswer: '16',
            colorType: 'red-green',
        },
        {
            image: require('../../assets/26.jpg'),
            options: ['28', '13', '26', 'None'],
            correctAnswer: '26',
            colorType: 'Neutral',
        },
        {
            image: require('../../assets/29.jpg'),
            options: ['20', '29', '10', 'None'],
            correctAnswer: '29',
            colorType: 'red-green',
        },
        {
            image: require('../../assets/35.jpg'),
            options: ['35', '25', '76', 'None'],
            correctAnswer: '35',
            colorType: 'Neutral',
        },
        {
            image: require('../../assets/42.jpg'),
            options: ['72', '42', '48', 'None'],
            correctAnswer: '42',
            colorType: 'Neutral',
        },
        {
            image: require('../../assets/45.jpg'),
            options: ['45', '42', '48', 'None'],
            correctAnswer: '45',
            colorType: 'red-green',
        },
        {
            image: require('../../assets/57.jpg'),
            options: ['57', '61', '75', 'None'],
            correctAnswer: '57',
            colorType: 'red-green',
        },
        {
            image: require('../../assets/73.jpg'),
            options: ['13', '78', '73', 'None'],
            correctAnswer: '73',
            colorType: 'red-green',
        },
        {
            image: require('../../assets/74.jpg'),
            options: ['74', '78', '73', 'None'],
            correctAnswer: '74',
            colorType: 'red-green',
        },
        {
            image: require('../../assets/96.jpg'),
            options: ['69', '96', '38', 'None'],
            correctAnswer: '96',
            colorType: 'Neutral',
        },
        {
            image: require('../../assets/97.jpg'),
            options: ['97', '31', '11', 'None'],
            correctAnswer: '97',
            colorType: 'red-green',
        },
        {
            image: require('../../assets/None1.jpg'),
            options: ['7', '11', '6', 'None'],
            correctAnswer: 'None',
            colorType: 'red-green',
        },
        {
            image: require('../../assets/None2.jpg'),
            options: ['42', '29', '16', 'None'],
            correctAnswer: 'None',
            colorType: 'red-green',
        },
        {
            image: require('../../assets/None3.jpg'),
            options: ['74', '4', '73', 'None'],
            correctAnswer: 'None',
            colorType: 'red-green',
        },
        {
            image: require('../../assets/None4.jpg'),
            options: ['4', '11', '31', 'None'],
            correctAnswer: 'None',
            colorType: 'red-green',
        },
        {
            image: require('../../assets/None5.jpg'),
            options: ['0', '3', '2', 'None'],
            correctAnswer: 'None',
            colorType: 'Neutral',
        },
        {
            image: require('../../assets/None6.jpg'),
            options: ['7', '24', '79', 'None'],
            correctAnswer: 'None',
            colorType: 'Neutral',
        },
        {
            image: require('../../assets/None7.jpg'),
            options: ['31', '42', '69', 'None'],
            correctAnswer: 'None',
            colorType: 'red-green',
        },
        // Add more questions (25 total)
      ];

  useEffect(() => {
    const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffledQuestions);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    Animated.timing(progress, {
      toValue: timeLeft / 30,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    } else {
      setMissedColors((prev) => [...prev, currentQuestion.colorType]);
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
      progress.setValue(1); // Reset progress bar
    } else {
      setQuizCompleted(true);
    }
  };


  const resetQuiz = () => {
    setScore(0);
    setMissedColors([]);
    setCurrentQuestionIndex(0);
    setTimeLeft(30);
    progress.setValue(1);
    setQuizCompleted(false);
  };

   const generateReport = async () => {
     const redGreenMistakes = missedColors.filter((type) => type === 'red-green').length;
     const neutralMistakes = missedColors.filter((type) => type === 'Neutral').length;

     // Dynamic report content
     let colorBlindnessType = '';
     let reasons = '';
     let resources = '';

     if (redGreenMistakes >= 5 && neutralMistakes >= 3) {
       colorBlindnessType = 'Severe Red-Green Color Blindness with Neutral Confusion';
       reasons = `
         Based on your answers, you missed a significant number of red-green and neutral color-based questions.
         This pattern indicates difficulty distinguishing between red-green hues, often combined with confusion in neutral shades.
       `;
       resources = `
         <ul>
           <li><a href="https://enchroma.com/">EnChroma Glasses</a> - Glasses to assist with red-green color blindness.</li>
           <li><a href="https://colorblindawareness.org/">Color Blind Awareness</a> - Educational resources and support.</li>
           <li><a href="https://play.google.com/store/apps/details?id=com.colorblindpal.android">Color Blind Pal</a> - An app to identify colors in real time.</li>
         </ul>
       `;
     } else if (redGreenMistakes >= 5) {
       colorBlindnessType = 'Severe Red-Green Color Blindness';
       reasons = `
         You missed several red-green-based questions, suggesting significant difficulty distinguishing these colors.
       `;
       resources = `
         <ul>
           <li><a href="https://enchroma.com/">EnChroma Glasses</a> - Glasses for red-green color blindness assistance.</li>
           <li><a href="https://colorblindawareness.org/">Color Blind Awareness</a> - Learn about red-green color blindness.</li>
           <li><a href="https://www.colour-blindness.com/">Colour Blindness Resources</a> - Comprehensive guides on color blindness.</li>
         </ul>
       `;
     } else if (redGreenMistakes > 2) {
       colorBlindnessType = 'Moderate Red-Green Color Blindness';
       reasons = `
         You missed a few red-green-based questions, indicating moderate difficulty distinguishing these colors.
       `;
       resources = `
         <ul>
           <li><a href="https://www.colour-blindness.com/">Colour Blindness Resources</a> - Guides on managing moderate color blindness.</li>
           <li><a href="https://play.google.com/store/apps/details?id=com.colorblindpal.android">Color Blind Pal</a> - An app to identify colors.</li>
         </ul>
       `;
     } else if (neutralMistakes >= 3) {
       colorBlindnessType = 'Potential Neutral Color Vision Anomaly';
       reasons = `
         Your answers indicate difficulty with neutral hues, which may suggest a rare form of color vision deficiency.
       `;
       resources = `
         <ul>
           <li><a href="https://colorblindawareness.org/">Color Blind Awareness</a> - Learn about neutral color vision anomalies.</li>
           <li><a href="https://www.colour-blindness.com/">Colour Blindness Resources</a> - More information on rare color vision issues.</li>
         </ul>
       `;
     } else if (score === questions.length) {
       colorBlindnessType = 'No Color Blindness Detected';
       reasons = `
         You answered all questions correctly, indicating no signs of color blindness.
       `;
       resources = `
         <h2>Learn About Color Blindness</h2>
         <p>Even though you don't have color blindness, it's important to understand it to support others:</p>
         <ul>
           <li><a href="https://colorblindawareness.org/">Color Blind Awareness</a> - Understand the challenges and solutions.</li>
           <li><a href="https://enchroma.com/">EnChroma Technology</a> - Learn about advancements in color blindness assistance.</li>
           <li><a href="https://www.colour-blindness.com/">Colour Blindness Resources</a> - Guides on color vision science and education.</li>
         </ul>
       `;
     } else {
       colorBlindnessType = 'Mild Color Vision Deficiency';
       reasons = `
         You missed a few questions, which might indicate mild difficulty with specific colors.
       `;
       resources = `
         <ul>
           <li><a href="https://colorblindawareness.org/">Color Blind Awareness</a> - Learn about mild color vision deficiencies.</li>
           <li><a href="https://www.colour-blindness.com/">Colour Blindness Resources</a> - Manage mild challenges effectively.</li>
         </ul>
       `;
     }

     // HTML content for the report
     const htmlContent = `
       <h1>Color Vision Test Report</h1>
       <p><strong>Score:</strong> ${score} / ${questions.length}</p>
       <p><strong>Result:</strong> ${colorBlindnessType}</p>
       <h2>Reasons</h2>
       <p>${reasons}</p>
       <h2>Resources</h2>
       ${resources}
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
      <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
        <Text style={styles.scoreText}>Your Score: {score} / {questions.length}</Text>
        <TouchableOpacity style={styles.gradientButton} onPress={shareReport}>
          <Text style={styles.buttonText}>Download Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gradientButton} onPress={resetQuiz}>
          <Text style={styles.buttonText}>Retake Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gradientButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

    return (
      <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
        <Animated.View
          style={[
            styles.timerBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
        <Text style={styles.timerText}>Time Left: {timeLeft}s</Text>
        {currentQuestion && (
          <>
            <FastImage
              source={currentQuestion.image || require('../../assets/default.jpg')}
              style={styles.image}
            />
            <View style={styles.optionsGrid}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.gridOption}
                  onPress={() => handleAnswer(option)}
                >
                  <LinearGradient colors={['#FF512F', '#F09819']} style={styles.optionContainer}>
                    <Text style={styles.optionText}>{option}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </LinearGradient>
    );
  };

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    timerBar: { height: 5, backgroundColor: '#ff512f', alignSelf: 'flex-start', marginBottom: 10 },
    timerText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    image: { width: 300, height: 300, borderRadius: 15, marginBottom: 20, elevation: 5 },
    optionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginHorizontal: 10,
    },
    gridOption: {
      width: '45%',
      height: 100,
      marginVertical: 10,
    },
    optionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    optionText: { fontSize: 18, color: '#FFF', fontWeight: 'bold' },
    scoreText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    gradientButton: {
      padding: 12,
      borderRadius: 8,
      marginVertical: 10,
      backgroundColor: '#ff512f',
      alignSelf: 'center',
      width: '80%',
      alignItems: 'center',
    },
    buttonText: { fontSize: 16, color: '#FFF', fontWeight: '600' },
  });

export default IshiharaQuizScreen;
