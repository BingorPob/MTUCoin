'use client';

import { useState } from "react";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { useTypedSession } from "@/hooks/use-typed-session"; // Import the custom hook

// Define the type for the secret object
interface Secret {
  ascii: string;
  base32: string;
  hex: string;
  otpauth_url: string;
}

const Setup2FA = () => {
  const { data: session } = useTypedSession();
  const [secret, setSecret] = useState<Secret | null>(null);
  const [qrCode, setQrCode] = useState("");

  const generate2FA = async () => {
    const secret = speakeasy.generateSecret({ length: 20 }) as Secret;
    setSecret(secret);

    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) {
        console.error("Error generating QR code:", err);
        return;
      }
      setQrCode(data_url);
    });
  };

  const verifyToken = async (token: string) => {
    if (!secret || !session?.user?.id) {
      console.error("Secret is not generated or user is not authenticated");
      return;
    }

    const verified = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: "base32",
      token,
    });

    if (verified) {
      // Save the secret to the user's account
      await fetch("/api/save-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, secret: secret.base32 }),
      });
    }
  };

  return (
    <div>
      <h1>Set up Two-Factor Authentication</h1>
      <button onClick={generate2FA}>Generate 2FA</button>
      {qrCode && (
        <div>
          <img src={qrCode} alt="QR Code" />
          <p>Scan this QR code with your Google Authenticator app</p>
        </div>
      )}
      <form onSubmit={(e) => {
        e.preventDefault();
        const token = (e.target as HTMLFormElement).token.value;
        verifyToken(token);
      }}>
        <input type="text" name="token" placeholder="Enter the token" />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default Setup2FA;
