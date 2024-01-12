import React, { useState } from 'react';
import { Box, Text, VStack, Pressable } from '@gluestack-ui/themed'; // Sesuaikan dengan import komponen dari library Anda
import { Checkbox, CheckboxIndicator, CheckboxIcon } from '@gluestack-ui/themed'; // Sesuaikan dengan import komponen Checkbox dari library Anda
import { CheckIcon } from '@gluestack-ui/themed'; // Sesuaikan dengan import ikon dari library Anda
import { useNavigation } from '@react-navigation/native';

const Aturan = () => {
    const navigation = useNavigation();
    const [isChecked, setIsChecked] = useState(true); // State untuk nilai checkbox, diatur menjadi false agar tidak tercentang secara awal

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked); // Mengubah nilai checkbox saat diklik
    };
    const handlePressableClick = () => {
        if (isChecked) {
            // Lakukan tindakan yang diinginkan jika checkbox tercentang
            // console.log('Tombol Diklik karena Checkbox tercentang');
            // Tambahkan logika atau aksi lain yang ingin Anda lakukan saat tombol diklik dan checkbox tercentang
            navigation.goBack(); // Kembali ke layar sebelumnya saat tombol ditekan
        }
    };
    return (
        <Box backgroundColor='#fff' justifyContent='center' alignItems='center'>
            <VStack width={'100%'} height={'100%'} justifyContent='center' alignItems='center' paddingHorizontal={45}>
                <Text fontSize={25} fontWeight='bold' padding={5}>
                    Aturan Attire Emporium
                </Text>
                <Text marginTop={15} textAlign='justify'>               
Panduan bagi penyewa dan pemilik kostum penting untuk memastikan transaksi yang lancar. Penyewa harus komunikasi melalui saluran aman, tentukan detail pengiriman, lakukan pemeriksaan bersama, dan lakukan pembayaran sesuai. Pemilik kostum harus berikan informasi jelas, atur jaminan, dan pastikan keamanan pembayaran, serta serahkan kostum dalam kondisi baik dengan petunjuk penggunaan. Kedua belah pihak sebaiknya melakukan pemeriksaan bersama saat pengembalian untuk mencatat kondisi kostum. Dengan mematuhi panduan ini, transaksi penyewaan kostum dapat berjalan dengan lancar dan tanpa masalah.
                </Text>
                <VStack justifyContent='center' alignItems='center' marginTop={15}>
                    <Checkbox
                        size="md"
                        isInvalid={false}
                        isDisabled={false}
                        aria-label="Label Checkbox"
                        isChecked={isChecked} // Menyimpan nilai dari state isChecked untuk mengontrol kondisi checkbox
                        onChange={handleCheckboxChange} // Mengatur fungsi untuk menangani perubahan checkbox
                    >
                        <CheckboxIndicator mr="$2" >
                            <CheckboxIcon as={CheckIcon} />
                        </CheckboxIndicator>
                        <Text fontWeight='bold' textAlign='justify'>
                            Saya setuju dengan aturan diatas, tidak akan melanggar satu aturan pun dan akan menerima sanksi jika melanggar.
                        </Text>
                    </Checkbox>

                    <Pressable
                        marginTop={15}
                        onPress={handlePressableClick
                        }
                    >
                        <Text
                            backgroundColor='#021C35'
                            color='#fff'
                            textAlign='justify'
                            fontWeight='bold'
                            paddingVertical={10}
                            paddingHorizontal={80}
                            borderRadius={10}
                            opacity={isChecked ? 1 : 0.5} // Mengatur opasitas tombol berdasarkan kondisi checkbox
                        >
                            Simpan Perubahan
                        </Text>
                    </Pressable>
                </VStack>
            </VStack>
        </Box>
    );
};

export default Aturan;
