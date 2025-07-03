import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, TextInput, Button, HelperText } from 'react-native-paper';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ visible, onClose, onSubmit, loading, error }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [currentPasswordConfirm, setCurrentPasswordConfirm] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = async () => {
    setLocalError(null);
    if (!currentPassword || !currentPasswordConfirm || !newPassword) {
      setLocalError('모든 항목을 입력해주세요.');
      return;
    }
    if (currentPassword !== currentPasswordConfirm) {
      setLocalError('현재 비밀번호가 일치하지 않습니다.');
      return;
    }
    await onSubmit(currentPassword, newPassword);
  };

  const handleClose = () => {
    setCurrentPassword('');
    setCurrentPasswordConfirm('');
    setNewPassword('');
    setLocalError(null);
    onClose();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={handleClose} contentContainerStyle={styles.modalContainer}>
        <Text style={styles.title}>비밀번호 변경</Text>
        <TextInput
          label="현재 비밀번호"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          label="현재 비밀번호 확인"
          value={currentPasswordConfirm}
          onChangeText={setCurrentPasswordConfirm}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          label="새 비밀번호"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
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
          <Button mode="contained" onPress={handleChange} loading={loading} disabled={loading} style={styles.button}>
            변경하기
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

export default ChangePasswordModal;
