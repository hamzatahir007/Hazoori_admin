// components/MapModal.jsx
import React, { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Modal, Button } from "antd";
import GoogleMapKey from "../constans/GoogleMapKey";

const containerStyle = {
    width: "100%",
    height: "400px",
};

const defaultCenter = {
    lat: 24.7136, // default to Riyadh
    lng: 46.6753,
};

const MapModal = ({ visible, onClose, onConfirm }) => {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: GoogleMapKey.GOOGLE_MAP_KEY, // 🔑 add your key
    });

    const [marker, setMarker] = useState(defaultCenter);

    const handleClick = (event) => {
        setMarker({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        });
    };

    return (
        <Modal
            title="Select Company Location"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button
                    key="confirm"
                    type="primary"
                    onClick={() => {
                        onConfirm(marker);
                        onClose();
                    }}
                >
                    Confirm
                </Button>,
            ]}
            width={800}
        >
            {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={marker}
                  zoom={12}
                  onClick={handleClick}
                >
                  <Marker position={marker} />
                </GoogleMap>
            ) : (
                <p>Loading map...</p>
            )}
        </Modal>
    );
};

export default MapModal;
