import React from 'react';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Center,
    Heading,
    Icon,
    CloseIcon,
    Button,
    ButtonText,
    Text,
} from '@gluestack-ui/themed';
import { useState } from 'react';
const Errormodal = ({ showModal, setShowModal, errorText }) => {
    const [errorModalText, setErrorModalText] = useState(errorText);
    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <ModalBackdrop />
            <ModalContent borderWidth={1} borderColor='black'
                borderRightWidth={4}
                borderBottomWidth={4} rounded={7}>
                <ModalHeader>
                    <Heading size="lg">Error</Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <Text>Email/Password salah! silahkan cek ulang </Text>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outline"
                        size="sm"
                        action="secondary"
                        borderColor='black'
                        borderRightWidth={3}
                        borderBottomWidth={3}
                        onPress={() => setShowModal(false)}
                    >
                        <ButtonText>Close</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default Errormodal;
