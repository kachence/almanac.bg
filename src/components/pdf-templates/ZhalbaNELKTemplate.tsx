"use client"

import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register Roboto font with proper bold variant
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 'normal',
      fontStyle: 'normal'
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 'bold',
      fontStyle: 'normal'
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 'normal',
      fontStyle: 'italic'
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 'bold',
      fontStyle: 'italic'
    }
  ]
})

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 1.3
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25
  },
  vhNumber: {
    fontSize: 12,
    textAlign: 'left',
    width: '35%'
  },
  addressToSection: {
    fontSize: 12,
    textAlign: 'right',
    lineHeight: 1.3,
    width: '60%'
  },
  addressToLine: {
    marginBottom: 2
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 6,
    fontWeight: 'bold'
  },
  fromLine: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'baseline'
  },
  fromLabel: {
    fontSize: 12,
    marginRight: 5
  },
  fromValue: {
    fontSize: 12,
    flex: 1,
    borderBottom: '1 dotted #000000',
    paddingBottom: 1,
    textAlign: 'left'
  },
  underlineNote: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 8,
    fontStyle: 'italic'
  },
  twoColumnRow: {
    flexDirection: 'row',
    marginBottom: 3,
    justifyContent: 'space-between'
  },
  leftColumn: {
    width: '45%'
  },
  rightColumn: {
    width: '50%'
  },
  multiColumnRow: {
    flexDirection: 'row',
    marginBottom: 6,
    justifyContent: 'space-between',
    alignItems: 'baseline'
  },
  expertDecisionRow: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 3,
    alignItems: 'baseline',
    flexWrap: 'wrap'
  },
  expertDecisionSecondRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'baseline',
    flexWrap: 'wrap'
  },
  complainTitle: {
    fontSize: 12,
    fontFamily: 'Roboto',
    textAlign: 'left',
    marginTop: 15,
    marginBottom: 12,
    textDecoration: 'underline',
    fontWeight: 'bold'
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.4,
    marginBottom: 12,
    textAlign: 'justify'
  },
  boldText: {
    fontFamily: 'Roboto',
    fontWeight: 'bold'
  },
  signature: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'flex-start'
  },
  signatureLeft: {
    flex: 1,
    paddingRight: 20
  },
  signatureRight: {
    flex: 1,
    paddingLeft: 20
  },
  signatureLine: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'baseline'
  },
  signatureLabel: {
    fontSize: 12,
    marginRight: 5
  },
  signatureDots: {
    flex: 1,
    borderBottom: '1 dotted #000000',
    paddingBottom: 1,
    minHeight: 12
  },
  dottedLine: {
    borderBottom: '1 dotted #000000',
    paddingBottom: 1
  },
  shortField: {
    width: 80
  },
  mediumField: {
    width: 120
  },
  longField: {
    width: 200
  }
})

interface FormData {
  fullName?: string
  egn?: string
  address?: string
  municipality?: string
  region?: string
  blockNumber?: string
  entrance?: string
  apartment?: string
  floor?: string
  phone?: string
  expertDecisionNumber?: string
  expertDecisionDate?: string
  diseaseLocation?: string
  telkPercentage?: string
  schedulingDate?: string
  signingLocation?: string
  rkmeCity?: string
  diseaseType?: string
  complaintDetails?: string
  signerName?: string
}

interface ZhalbaNELKTemplateProps {
  formData: FormData
}

const ZhalbaNELKTemplate: React.FC<ZhalbaNELKTemplateProps> = ({ formData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Row - Входящ номер и Адрес до институцията */}
      <View style={styles.headerRow}>
        {/* Входящ номер */}
        <View style={styles.vhNumber}>
          <Text>Вх. № ................/................</Text>
        </View>

        {/* Адрес до институцията */}
        <View style={styles.addressToSection}>
          <Text style={styles.addressToLine}>ЧРЕЗ</Text>
          <Text style={styles.addressToLine}>РЕГИОНАЛНА КАРТОТЕКА НА</Text>
          <Text style={styles.addressToLine}>МЕДИЦИНСКАТА ЕКСПЕРТИЗА /РКМЕ/</Text>
          <Text style={styles.addressToLine}>ГР. {formData.rkmeCity || '.......................'}</Text>
          <Text style={[styles.addressToLine, { marginTop: 8 }]}>ДО</Text>
          <Text style={styles.addressToLine}>НАЦИОНАЛНА ЕКСПЕРТНА</Text>
          <Text style={styles.addressToLine}>ЛЕКАРСКА КОМИСИЯ /НЕЛК/</Text>
          <Text style={styles.addressToLine}>ГР. СОФИЯ</Text>
        </View>
      </View>

      {/* Заглавие */}
      <Text style={styles.title}>Ж А Л Б А</Text>

      {/* От секция */}
      <View style={styles.fromLine}>
        <Text style={styles.fromLabel}>От</Text>
        <Text style={[styles.fromValue, styles.dottedLine]}>
          {formData.fullName || ''}
        </Text>
      </View>
      <Text style={styles.underlineNote}>/име, презиме, фамилия/</Text>

      {/* ЕГН и Адрес ред */}
      <View style={styles.twoColumnRow}>
        <View style={[styles.leftColumn, styles.fromLine]}>
          <Text style={styles.fromLabel}>ЕГН:</Text>
          <Text style={[styles.fromValue, styles.dottedLine]}>
            {formData.egn || ''}
          </Text>
        </View>
        <View style={[styles.rightColumn, styles.fromLine]}>
          <Text style={styles.fromLabel}>Адрес: гр./с./</Text>
          <Text style={[styles.fromValue, styles.dottedLine]}>
            {formData.address || ''}
          </Text>
        </View>
      </View>

      {/* Община и Област ред */}
      <View style={styles.twoColumnRow}>
        <View style={[styles.leftColumn, styles.fromLine]}>
          <Text style={styles.fromLabel}>Община</Text>
          <Text style={[styles.fromValue, styles.dottedLine]}>
            {formData.municipality || ''}
          </Text>
        </View>
        <View style={[styles.rightColumn, styles.fromLine]}>
          <Text style={styles.fromLabel}>Област</Text>
          <Text style={[styles.fromValue, styles.dottedLine]}>
            {formData.region || ''}
          </Text>
        </View>
      </View>

      {/* кв./ул./ бл.№ вх. ап. ет. ред */}
      <View style={styles.multiColumnRow}>
        <Text style={styles.fromLabel}>кв./ул./</Text>
        <Text style={[styles.dottedLine, styles.shortField]}>
          {formData.blockNumber || ''}
        </Text>
        <Text style={styles.fromLabel}>бл.№</Text>
        <Text style={[styles.dottedLine, styles.shortField]}>
          {formData.blockNumber || ''}
        </Text>
        <Text style={styles.fromLabel}>вх.</Text>
        <Text style={[styles.dottedLine, styles.shortField]}>
          {formData.entrance || ''}
        </Text>
        <Text style={styles.fromLabel}>ап.</Text>
        <Text style={[styles.dottedLine, styles.shortField]}>
          {formData.apartment || ''}
        </Text>
        <Text style={styles.fromLabel}>ет.</Text>
        <Text style={[styles.dottedLine, styles.shortField]}>
          {formData.floor || ''}
        </Text>
      </View>

      {/* Телефон ред */}
      <View style={styles.fromLine}>
        <Text style={styles.fromLabel}>Телефон за връзка</Text>
        <Text style={[styles.fromValue, styles.dottedLine]}>
          {formData.phone || ''}
        </Text>
      </View>

      {/* СРЕЩУ: ЕКСПЕРТНО РЕШЕНИЕ */}
      <View style={styles.expertDecisionRow}>
        <Text style={styles.fromLabel}>Срещу:</Text>
        <Text style={styles.fromLabel}>ЕКСПЕРТНО РЕШЕНИЕ №</Text>
        <Text style={[styles.dottedLine, styles.mediumField]}>
          {formData.expertDecisionNumber || ''}
        </Text>
        <Text style={styles.fromLabel}>от дата</Text>
        <Text style={[styles.dottedLine, styles.mediumField]}>
          {formData.expertDecisionDate ? 
            new Date(formData.expertDecisionDate).toLocaleDateString('bg-BG') : ''
          }
        </Text>
      </View>

      {/* На ТЕЛК за... ЗАБОЛЯВАНИЯ */}
      <View style={styles.expertDecisionSecondRow}>
        <Text style={styles.fromLabel}>На ТЕЛК за</Text>
        <Text style={[styles.dottedLine, styles.mediumField]}>
          {formData.diseaseType || ''}
        </Text>
        <Text style={styles.fromLabel}>ЗАБОЛЯВАНИЯ гр.</Text>
        <Text style={[styles.dottedLine, styles.longField]}>
          {formData.diseaseLocation || ''}
        </Text>
      </View>

      {/* УВАЖАЕМИ ЧЛЕНОВЕ НА НЕЛК */}
      <Text style={styles.complainTitle}>УВАЖАЕМИ ЧЛЕНОВЕ НА НЕЛК,</Text>

      {/* Основен текст на жалбата */}
      <Text style={styles.paragraph}>
        На {formData.expertDecisionDate ? 
          new Date(formData.expertDecisionDate).toLocaleDateString('bg-BG') : '.....................'}г. получих горепосоченото Експертно решение на ТЕЛК, с което ми бе определен {formData.telkPercentage || '................'}%
      </Text>

      {/* Разширени линии за текст (complaint details) */}
      <View style={{ marginBottom: 10 }}>
        {formData.complaintDetails ? (
          <Text style={[styles.paragraph, { lineHeight: 1.6, marginBottom: 10 }]}>
            {formData.complaintDetails}
          </Text>
        ) : (
          <>
            <Text style={[styles.dottedLine, { marginBottom: 5, height: 12 }]}></Text>
            <Text style={[styles.dottedLine, { marginBottom: 5, height: 12 }]}></Text>
            <Text style={[styles.dottedLine, { marginBottom: 5, height: 12 }]}></Text>
            <Text style={[styles.dottedLine, { marginBottom: 5, height: 12 }]}></Text>
            <Text style={[styles.dottedLine, { marginBottom: 5, height: 12 }]}></Text>
          </>
        )}
      </View>

      <Text style={styles.paragraph}>
        <Text style={styles.boldText}>Считам, че горепосоченото решение е неправилно и го обжалвам в срок, съгласно разпоредбите на чл.112, ал.1, т.3 от Закона за здравето. </Text>
        <Text style={styles.boldText}>МОЛЯ</Text>, да насрочите дата на която да се явя пред Вас, съгласно разпоредбите на чл.45, ал.1 от ПУОРОМЕРКМЕ.
      </Text>

      <Text style={styles.paragraph}>
      </Text>

      {/* Подпис */}
      <View style={styles.signature}>
        {/* Лява страна */}
        <View style={styles.signatureLeft}>
          <View style={styles.signatureLine}>
            <Text style={styles.signatureLabel}>Дата</Text>
            <Text style={styles.signatureDots}>
              {formData.schedulingDate ? 
                new Date(formData.schedulingDate).toLocaleDateString('bg-BG') : ''}
            </Text>
          </View>
          <View style={styles.signatureLine}>
            <Text style={styles.signatureLabel}>Град</Text>
            <Text style={styles.signatureDots}>
              {formData.signingLocation || ''}
            </Text>
          </View>
        </View>

        {/* Дясна страна */}
        <View style={styles.signatureRight}>
          <View style={styles.signatureLine}>
            <Text style={styles.signatureLabel}>С уважение:</Text>
            <Text style={styles.signatureDots}></Text>
          </View>
          <View style={styles.signatureLine}>
            <Text style={styles.signatureLabel}>/</Text>
            <Text style={styles.signatureDots}>
              {formData.signerName || ''}
            </Text>
            <Text style={styles.signatureLabel}>/</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
)

export default ZhalbaNELKTemplate
