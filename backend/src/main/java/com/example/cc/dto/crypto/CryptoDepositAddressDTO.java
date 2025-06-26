package com.example.cc.dto.crypto;

import com.example.cc.entities.CryptoTransaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoDepositAddressDTO {
    private CryptoTransaction.CryptoType cryptoType;
    private String address;
    private String qrCode;
    private String expiresAt;
}
