// src/components/PDFGenerator.js
import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Register fonts if needed (you might need to install additional dependencies)
// Font.register({ family: 'Roboto', src: '/path/to/roboto.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    borderBottom: '1pt solid black',
    paddingBottom: 10,
  },
  logo: {
    width: 120,
    height: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
    borderBottom: '0.5pt solid #333',
    paddingBottom: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  col: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontWeight: 'bold',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: 'grey',
  },
  note: {
    fontStyle: 'italic',
    marginTop: 5,
    fontSize: 9,
  },
  signature: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '40%',
    borderTop: '1pt solid black',
    paddingTop: 5,
    textAlign: 'center',
  },
});

const PDFGenerator = ({ shipmentData }) => {
  // Filter out empty charges
  const validCharges = shipmentData.charges ? 
    shipmentData.charges.filter(charge => 
      charge.description && charge.amount !== undefined && charge.amount !== null && charge.amount !== ''
    ) : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with logo and title */}
        <View style={styles.header}>
          <Image 
            style={styles.logo} 
            src="/seal.png" // Make sure this path is correct
          />
          <View>
            <Text style={styles.title}>MULTIMODAL TRANSPORT DOCUMENT</Text>
            <Text>MTD Registration No.: {shipmentData.mtdNumber || 'MTD/DOS/566/JAN/2028'}</Text>
            <Text>CN: {shipmentData.cnNumber || 'U630130L1990PTC042315'}</Text>
          </View>
        </View>

        {/* Shipper Information */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Shipper</Text>
          <Text>{shipmentData.shipper?.name || 'FIE SPHEROTECH'}</Text>
          <Text>{shipmentData.shipper?.address || 'PLOT NO.6,7,8,18 & SHREE LAXM CO-OP INDUSTRIAL ESTATE LTD. HATKAMANGALE - 416109,DIST - KOLHAPUR MAHARASHITRA - INDIA'}</Text>
          <Text>TEL: {shipmentData.shipper?.tel || '(0230)2366271,2366215'} FAX: {shipmentData.shipper?.fax || '(0230)2366133'}</Text>
        </View>

        {/* Freight Forwarder Information */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Scal Freight</Text>
          <Text>SEAL FREIGHT FORWARDERS PVT. LTD.</Text>
          <Text>T-2, Illrd Floor, H Block Market, LSC Plot No. 7, Manish Complex</Text>
          <Text>Sarita Plaza, New Delhi-110076 INDIA</Text>
          <Text>Mob.: +91 8483811885, Tel: +91 822 27586278, 79 Email: info@seal.co.in, Website: www.sealfreight.com</Text>
        </View>

        {/* Consignee Information */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Consignee (of order):</Text>
          <Text>{shipmentData.consignee?.name || 'THAI SENG TRADING CO., LTD.'}</Text>
          <Text>{shipmentData.consignee?.address || '10-8,OBASE-CHO TENNOJI-KU,OSAKA JAPAN'}</Text>
          <Text>K.A. {shipmentData.consignee?.contact || 'MR.MOTOHIKO FUKUNAGA'}</Text>
          <Text>TEL {shipmentData.consignee?.tel || '(81) 6-6796-9359'}</Text>
        </View>

        {/* Notify Party */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Notify Party:</Text>
          <Text>{shipmentData.notifyParty?.name || 'THAI SENG TRADING CO., LTD.'}</Text>
          <Text>{shipmentData.notifyParty?.address || '10-8,OBASE-CHO TENNOJI-KU,OSAKA JAPAN'}</Text>
          <Text>K.A. {shipmentData.notifyParty?.contact || 'MR.MOTOHIKO FUKUNAGA'}</Text>
          <Text>TEL {shipmentData.notifyParty?.tel || '(81) 6-6796-9359'}</Text>
        </View>

        {/* Plan of Acceptance and Shipping Details */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Plan of Acceptance</Text>
          <Text>{shipmentData.planOfAcceptance || 'NHAVA SHEVA, INDIA'}</Text>
          
          <View style={[styles.row, {marginTop: 10}]}>
            <View style={styles.col}>
              <Text><Text style={styles.label}>Vessel:</Text> {shipmentData.vessel || 'WAN HAI 512 / E115'}</Text>
            </View>
            <View style={styles.col}>
              <Text><Text style={styles.label}>Port of Loading:</Text> {shipmentData.portOfLoading || 'NHAVA SHEVA, INDIA'}</Text>
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={styles.col}>
              <Text><Text style={styles.label}>Port of Discharge:</Text> {shipmentData.portOfDischarge || 'YOKOHAMA, JAPAN'}</Text>
            </View>
            <View style={styles.col}>
              <Text><Text style={styles.label}>Port of Delivery:</Text> {shipmentData.portOfDelivery || 'YOKOHAMA, JAPAN'}</Text>
            </View>
          </View>
        </View>

        {/* Goods Description */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Container Marks & Number No(s)</Text>
          <Text>SAID TO CONTAIN</Text>
          <Text>{shipmentData.packages || '15 (FIFTEEN BOXES ONLY)'}</Text>
          <Text>{shipmentData.goodsDescription || 'CI CASTING (SIDE COVER R, SIDE COVER C, BALANCE WEIGHT, MAIN BIG RETAINER, REAR COVER, SUCTION VALVE BASE, REAR BEARING COVER & REAR BEARING HOLDER)'}</Text>
          <Text>INV. NO.: {shipmentData.invoiceNumber || '12/FSE/XP/2025-2026'} DT. {shipmentData.invoiceDate || '13/08/2025'}</Text>
          <Text>S/B NO.: {shipmentData.sbNumber || '448801'} DT. {shipmentData.sbDate || '14/08/2025'}</Text>
          <Text>HS CODE: {shipmentData.hsCode || '73251000'}</Text>
        </View>

        {/* Weight and Measurement */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>SOLD TO WEIGH/MEASURE</Text>
          <Text>{shipmentData.weight || '5774.000 KGS'} NET WT.</Text>
          <Text>{shipmentData.grossWeight || '8290.000 KGS'}</Text>
        </View>

        {/* Container Details */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Container No/Seal No</Text>
          <Text>{shipmentData.containerNumber || 'WHISU2266815 205DB6 WHA1382852'}</Text>
          <Text>{shipmentData.boxNumbers || 'BOX NO.1,2,3,4,5,6,7,8,9,10,11,12,13,14 & 15'}</Text>
        </View>

        {/* Charges Section - Only show if there are valid charges */}
        {validCharges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Charges</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text>Description</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text>Amount</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text>Currency</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text>Payment Terms</Text>
                </View>
              </View>
              {validCharges.map((charge, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableCol}>
                    <Text>{charge.description}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{charge.amount}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{charge.currency || 'USD'}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{charge.paymentTerms || 'Prepaid'}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Payment Terms */}
        <View style={styles.section}>
          <Text>{shipmentData.originCharges || '"ORIGIN THC PREPAID"'}</Text>
          <Text>{shipmentData.oceanFreight || '"OCEAN FREIGHT COLLECT"'}</Text>
          <Text>{shipmentData.destinationCharges || '"ALL DESTINATION CHARGES ON CONSIGNEE ACCOUNT"'}</Text>
          <Text style={styles.note}>DESTINATION ANCILLARY CHARGES TO CONSIGNEE'S ACCOUNT</Text>
          <Text style={styles.note}>CONSIGNEE/CONSIGNOR ARE ADVISED TO PURCHASE COMPREHENSIVE INSURANCE COVER TO PROTECT THEIR INTEREST IN ALL EVENTS</Text>
        </View>

        {/* Footer Information */}
        <View style={styles.section}>
          <Text>Draft</Text>
          <Text>Particulars above furnished by Consignee / Consumer, Weight and Measurement of container not to be included</Text>
          
          <View style={styles.row}>
            <View style={styles.col}>
              <Text>Freight Amount: {shipmentData.freightAmount || 'To be determined'}</Text>
              <Text>Freight Payable at: {shipmentData.freightPayableAt || '03 (THREE)'}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Agent */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Delivery Agent:</Text>
          <Text>{shipmentData.deliveryAgent?.name || 'NIHON HOSO UNYU CO., LTD.'}</Text>
          <Text>{shipmentData.deliveryAgent?.address || '2F, BRIGHT EAST SHIBAURA, 3-18-21 KAIGAN, MINATO-KU, TOKYO 108-0022, JAPAN'}</Text>
          <Text>TEL: {shipmentData.deliveryAgent?.tel || '81-3-6858-0321'} FAX: {shipmentData.deliveryAgent?.fax || '81-3-6852-6161'}</Text>
        </View>

        {/* Jurisdiction */}
        <View style={styles.section}>
          <Text>Subject to {shipmentData.jurisdiction || 'Delhi'} Jurisdiction</Text>
        </View>

        {/* Signatures */}
        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text>For Seal Freight Forwarders Pvt. Ltd.</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>Authorized Signature</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generated on {format(new Date(), 'dd/MM/yyyy HH:mm')} | Seal Freight Forwarders Pvt. Ltd.
        </Text>
      </Page>
    </Document>
  );
};

export default PDFGenerator;