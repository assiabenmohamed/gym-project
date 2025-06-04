import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { BodyTrackingEntry } from "@/app/(users)/types";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#fff",
    color: "#000",
    fontSize: 10,
  },
  header: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  table: {
    width: "auto",
    marginTop: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "16.6%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 4,
    fontWeight: "bold",
  },
  tableCol: {
    width: "16.6%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
  },
});

export default function BodyTrackingPDF({
  bodyTrackingData,
}: {
  bodyTrackingData: BodyTrackingEntry[];
}) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Body Tracking History</Text>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Date</Text>
            <Text style={styles.tableColHeader}>Weight</Text>
            <Text style={styles.tableColHeader}>Fat Mass</Text>
            <Text style={styles.tableColHeader}>Muscle Mass</Text>
            <Text style={styles.tableColHeader}>Metabolic Rate</Text>
            <Text style={styles.tableColHeader}>Note</Text>
          </View>

          {/* Rows */}
          {bodyTrackingData.map((entry) => (
            <View style={styles.tableRow} key={entry.id}>
              <Text style={styles.tableCol}>
                {new Date(entry.date).toLocaleDateString()}
              </Text>
              <Text style={styles.tableCol}>{entry.weight} kg</Text>
              <Text style={styles.tableCol}>{entry.fatMass ?? "-"} kg</Text>
              <Text style={styles.tableCol}>{entry.muscleMass ?? "-"} kg</Text>
              <Text style={styles.tableCol}>
                {entry.metabolicRate ?? "-"} kcal
              </Text>
              <Text style={styles.tableCol}>{entry.note ?? "-"}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
