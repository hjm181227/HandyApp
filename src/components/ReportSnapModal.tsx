import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, TextInput, HelperText, RadioButton } from 'react-native-paper';
import { ReportReason } from '../api/report';

const REPORT_REASONS: { label: string; value: ReportReason }[] = [
  { label: '스팸', value: 'SPAM' },
  { label: '부적절한 내용', value: 'INAPPROPRIATE' },
  { label: '괴롭힘', value: 'HARASSMENT' },
  { label: '폭력', value: 'VIOLENCE' },
  { label: '저작권 침해', value: 'COPYRIGHT' },
  { label: '개인정보 침해', value: 'PRIVACY' },
  { label: '사기', value: 'FRAUD' },
  { label: '기타', value: 'OTHER' },
];

interface ReportSnapModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReason, content: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const ReportSnapModal: React.FC<ReportSnapModalProps> = ({ visible, onClose, onSubmit, loading, error }) => {
  const [reason, setReason] = useState<ReportReason>('SPAM');
  const [content, setContent] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleReport = async () => {
    setLocalError(null);
    if (!reason) {
      setLocalError('신고 사유를 선택해주세요.');
      return;
    }
    await onSubmit(reason, content);
  };

  const handleClose = () => {
    setReason('SPAM');
    setContent('');
    setLocalError(null);
    onClose();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={handleClose} contentContainerStyle={styles.modalContainer}>
        <Text style={styles.title}>게시글 신고하기</Text>
        <RadioButton.Group onValueChange={value => setReason(value as ReportReason)} value={reason}>
          {REPORT_REASONS.map((item) => (
            <RadioButton.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </RadioButton.Group>
        <TextInput
          label="상세 설명 (선택)"
          value={content}
          onChangeText={setContent}
          multiline
          style={styles.input}
        />
        {(localError || error) && (
          <HelperText type="error" visible={true} style={styles.errorText}>
            {localError || error}
          </HelperText>
        )}
        <View style={styles.buttonRow}>
          <Button onPress={handleClose} style={styles.button} disabled={loading}>
            닫기
          </Button>
          <Button mode="contained" onPress={handleReport} loading={loading} disabled={loading} style={styles.button}>
            신고하기
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    margin: 24,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  errorText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    marginLeft: 8,
  },
});

export default ReportSnapModal; 