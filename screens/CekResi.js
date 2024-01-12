import React, { useState } from 'react'
import { Entypo } from "@expo/vector-icons";
import { Box, Text, Select, SelectTrigger, SelectIcon, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem, Input, InputField, Button, ButtonText, Heading, VStack, ScrollView, SelectScrollView, Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Center, Icon, CloseIcon } from '@gluestack-ui/themed'
import kurirlist from '../data/kurirlist';
const CekResi = () => {
    const [Kurir, setKurir] = useState('')
    const [Nomor, setNomor] = useState('')
    const [showModal, setShowModal] = useState(false)
    const ref = React.useRef(null)
    const [trackingData, setTrackingData] = useState(null);
    console.log(Kurir)
    console.log(Nomor)

    console.log(trackingData)

    const handleAddButtonPress = async () => {
        if (!Kurir || !Nomor ) {
            setShowModal(true);
            return;
        }
        try {
            // Construct API URL with the selected courier and AWB number
            const apiUrl = `https://api.binderbyte.com/v1/track?api_key=b261e39611d360130783b9b57b3e8517c23ec3603538849243768c4c7aad7a45&courier=${Kurir}&awb=${Nomor}`;

            // Make the API call
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Handle the API response data
            console.log('API Response:', data);

            // Update state with the tracking data
            setTrackingData(data.data);

        } catch (error) {
            console.error('Error fetching API:', error);
            Alert.alert('Error', 'Failed to fetch tracking information. Please try again.');
        }
    };
    return (
        <ScrollView backgroundColor='white'>
            <Box flex={1} >
                <Box p={20}>
                    <Heading>Track Barang</Heading>
                    <VStack space='lg' mt={20}>
                        <Box>
                            <Text>Nomor Resi:</Text>
                            <Input
                                borderBottomWidth={3}
                                borderEndWidth={3}
                                rounded={7}
                                mt={5}
                                borderColor='#021C35'
                            >
                                <InputField
                                    type="text"
                                    placeholder="Contoh : 20292871324"
                                    onChangeText={setNomor}
                                    keyboardType="numeric"
                                />
                            </Input>
                        </Box>
                        <Box>
                            <Text>Pilih Kurir:</Text>
                            <Select
                                borderBottomWidth={3}
                                mt={5}
                                borderTopWidth={1}
                                borderStartWidth={1}
                                borderEndWidth={3}
                                rounded={7}
                                borderColor='#021C35'
                                onValueChange={setKurir}
                            >
                                <SelectTrigger variant="outline" size="md" >
                                    <SelectInput placeholder="Pilih Kurir" />
                                    <SelectIcon mr="$3">
                                        <Entypo name="chevron-down" size={15} color="black" />
                                    </SelectIcon>
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                        <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator />
                                        </SelectDragIndicatorWrapper>
                                        <SelectScrollView>
                                            {kurirlist.map((courier) => (
                                                <SelectItem key={courier.code} label={courier.description} value={courier.code} />
                                            ))}
                                        </SelectScrollView>

                                    </SelectContent>
                                </SelectPortal>
                            </Select>
                        </Box>

                        <Button
                            size="md"
                            variant="solid"
                            action="primary"
                            backgroundColor='#000000'
                            isDisabled={false}
                            isFocusVisible={false}
                            onPress={handleAddButtonPress}
                        >
                            <ButtonText>Track </ButtonText>
                        </Button>
                    </VStack>

                    <Box>
                        {trackingData ? (
                            <Box marginTop={20}>
                                <Text fontWeight="bold">Tracking Summary:</Text>
                                <Text mt={5}>Resi: {trackingData.summary.awb}</Text>
                                <Text>Courier: {trackingData.summary.courier}</Text>
                                <Text>Status: {trackingData.summary.status}</Text>
                                {/* Add more details as needed */}

                                {/* Display history using Box instead of FlatList */}
                                <Text mt={20} fontWeight="bold">Tracking History:</Text>
                                {trackingData.history.map((item, index) => (
                                    <Box key={index} p={10} marginVertical={10} borderWidth={1} borderBottomWidth={5} borderEndWidth={5} rounded={5}>
                                        <Text>Date: {item.date}</Text>
                                        <Text>Description: {item.desc}</Text>
                                        <Text mb={10}>Location: {item.location}</Text>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Box marginTop={20}>
                                <Text fontWeight="bold">Tracking Summary:</Text>
                                <Text mt={5}>Resi: </Text>
                                <Text>Courier:</Text>
                                <Text>Status:</Text>
                            </Box>

                        )}
                    </Box>
                </Box>
                <Center h={300}>
                    <Modal
                        isOpen={showModal}
                        onClose={() => {
                            setShowModal(false)
                        }}
                        finalFocusRef={ref}
                    >
                        <ModalBackdrop />
                        <ModalContent borderWidth={1} borderColor='black'
                            borderRightWidth={4}
                            borderBottomWidth={4} rounded={7}>
                            <ModalHeader>
                                <Heading size="lg">Data belum terisi</Heading>
                                <ModalCloseButton>
                                    <Icon as={CloseIcon} />
                                </ModalCloseButton>
                            </ModalHeader>
                            <ModalBody>
                                <Text>
                                    Isi Resi dan Kurir dengan benar , jangan biarkan kosong seperti hati ini
                                </Text>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    size="sm"

                                    borderColor='black'
                                    backgroundColor='white'
                                    borderWidth={1}
                                    borderRightWidth={3}
                                    borderBottomWidth={3}
                                    onPress={() => {
                                        setShowModal(false)
                                    }}
                                >
                                    <ButtonText color='black'>Oke, mengerti</ButtonText>
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Center>

            </Box>
        </ScrollView>
    )
}

export default CekResi

