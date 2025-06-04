import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Définir les styles PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#fff",
    color: "#000",
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
  },
  table: {
    width: "100%",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "33%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
  },
});

const CaloriePDF = ({ calories }: { calories: number }) => {
  const tableData = [
    { goal: "Maintain weight", value: calories, percent: 100 },
    {
      goal: "Mild weight loss (0.25 kg/week)",
      value: calories * 0.9,
      percent: 90,
    },
    { goal: "Weight loss (0.5 kg/week)", value: calories * 0.79, percent: 79 },
    {
      goal: "Extreme weight loss (1 kg/week)",
      value: calories * 0.59,
      percent: 59,
    },
    {
      goal: "Mild weight gain (0.25 kg/week)",
      value: calories * 1.1,
      percent: 110,
    },
    { goal: "Weight gain (0.5 kg/week)", value: calories * 1.21, percent: 121 },
    {
      goal: "Fast weight gain (1 kg/week)",
      value: calories * 1.41,
      percent: 141,
    },
  ];

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Calorie Recommendations</Text>
        <View style={styles.table}>
          {tableData.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCol}>{item.goal}</Text>
              <Text style={styles.tableCol}>{Math.round(item.value)} kcal</Text>
              <Text style={styles.tableCol}>{item.percent}%</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default CaloriePDF;
