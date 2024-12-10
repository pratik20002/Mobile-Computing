import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf'; // For generating PDF
import Share from 'react-native-share'; // For sharing the report
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing test results

const colors = [
  '#b2766f', '#b17466', '#ae725f', '#a8745a', '#a87452', '#a8794e',
  '#a97e4c', '#a78244', '#a28946', '#9d8e48', '#97914b', '#8d9352',
  '#86955c', '#7e9760', '#7c9567', '#699a71', '#649a76', '#5b947a',
  '#589480', '#529687', '#4e9689', '#4c9691', '#4a9696', '#4a9698',
  '#52949f', '#6090a5', '#688fa7', '#6c8aa6', '#7489a7', '#7b84a3',
  '#8484a3', '#8d85a3', '#9483a0', '#99819d', '#9f7f98', '#a9798b',
  '#ae7787', '#b1757f', '#b3757a', '#b37673',
];

const generateBoxes = () => {
  return colors.map((color, index) => ({
    id: `${index}`,
    color,
    value: index,
  }));
};

const FarnsworthTestScreen = ({ route, navigation }: any) => {
  const userName = route?.params?.userName || 'Guest';
  const [data, setData] = useState(generateBoxes());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const calculateErrorScore = (sortedBoxes: typeof data) => {
    let totalErrorScore = 0;
    const val = new Array(sortedBoxes.length).fill(0);

    for (let i = 0; i < sortedBoxes.length - 2; i++) {
      const left = sortedBoxes[i].value;
      const mid = sortedBoxes[i + 1].value;
      const right = sortedBoxes[i + 2].value;

      const valLeft = Math.abs(left - mid);
      const valRight = Math.abs(mid - right);

      val[i + 1] = valLeft + valRight - 2;
    }

    totalErrorScore = val.reduce((acc, curr) => acc + curr, 0);
    return totalErrorScore;
  };

  const generateReport = async (errorScore: number, result: string) => {
    const htmlContent = `
      <h1>Farnsworth-Munsell 100 Hue Test Report</h1>
      <p><strong>Error Score:</strong> ${errorScore}</p>
      <p><strong>Result:</strong> ${result}</p>
      <h2>Details</h2>
      <p>This report reflects your color vision performance based on the Farnsworth test.</p>
      <h2>Recommendations</h2>
      <ul>
        <li><a href="https://colorblindawareness.org/">Color Blind Awareness</a> - Educational resources and support.</li>
        <li><a href="https://www.colour-blindness.com/">Colour Blindness Resources</a> - Guides and tips on managing color blindness.</li>
        <li><a href="https://play.google.com/store/apps/details?id=com.colorblindpal.android">Color Blind Pal</a> - An app to assist with color identification.</li>
      </ul>
    `;

    try {
      const options = {
        html: htmlContent,
        fileName: 'FarnsworthTestReport',
        directory: 'Documents',
      };
      const file = await RNHTMLtoPDF.convert(options);
      return file.filePath;
    } catch (error) {
      Alert.alert('Error', 'Could not generate PDF');
      console.error(error);
    }
  };

  const shareReport = async (errorScore: number, result: string) => {
    const pdfPath = await generateReport(errorScore, result);
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

  const handleBoxPress = (index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index); // Select the first box
    } else {
      // Swap the selected box with the clicked box
      const newData = [...data];
      [newData[selectedIndex], newData[index]] = [
        newData[index],
        newData[selectedIndex],
      ];
      setData(newData);
      setSelectedIndex(null); // Reset selection
    }
  };

  const handleSubmit = async () => {
    const errorScore = calculateErrorScore(data);
    let result = 'Normal Color Vision';
    if (errorScore > 80) result = 'Severe Color Blindness';
    else if (errorScore > 40) result = 'Moderate Color Blindness';
    else if (errorScore > 20) result = 'Mild Color Blindness';

    Alert.alert('Test Result', `Error Score: ${errorScore}\nResult: ${result}`, [
      {
        text: 'Share Report',
        onPress: () => shareReport(errorScore, result),
      },
      {
        text: 'OK',
        style: 'cancel',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farnsworth-Munsell 100 Hue Test</Text>
      <View style={styles.grid}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.box,
              { backgroundColor: item.color },
              selectedIndex === index && styles.selectedBox, // Highlight selected box
            ]}
            onPress={() => handleBoxPress(index)}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', backgroundColor: '#f9f9f9' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  box: {
    width: 35,
    height: 35,
    margin: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedBox: {
    borderColor: '#ff9800',
    borderWidth: 2,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default FarnsworthTestScreen;
