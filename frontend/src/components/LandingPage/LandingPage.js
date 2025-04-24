import styles from './LandingPage.module.css';
import Navbar from '../Navbar/Navbar';
import React, { useEffect, useState } from 'react';
import {
    AspectRatio,
    Card,
    CardContent,
    CardOverflow,
    Typography,
    Grid,
    Divider
} from '@mui/joy';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { useContext } from 'react';
import UserContext from '../Context/User/UserContext';
import StarRateIcon from '@mui/icons-material/StarRate';
import axios from 'axios';

function LandingPage() {
    const navigate = useNavigate();
    const { isUserLoggedIn } = useContext(UserContext);
    const [trainers, setTrainers] = useState([]);
    const [trainerImages, setTrainerImages] = useState({});

    const fetchTrainers = async () => {
        try {
            const response = await axios.get('/trainer/bestRatedTrainers');
            setTrainers(response.data);
            fetchTrainerImages(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchTrainerImages = async (trainers) => {
        const imagePromises = trainers.map(async (trainer) => {
            try {
                const response = await axios.get(`/trainer/image/${trainer.id}`, {
                    responseType: 'arraybuffer'
                });
                const byteArray = new Uint8Array(response.data);
                const blob = new Blob([byteArray], { type: 'image/jpeg' });
                const imageUrl = URL.createObjectURL(blob);
                return { id: trainer.id, url: imageUrl };
            } catch (error) {
                console.error(`Failed to fetch image for trainer ${trainer.id}:`, error);
                return { id: trainer.id, url: null };
            }
        });

        const images = await Promise.all(imagePromises);
        const imageMap = images.reduce((acc, { id, url }) => {
            acc[id] = url;
            return acc;
        }, {});
        setTrainerImages(imageMap);
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    const handleRegButton = () => {
        if (!isUserLoggedIn) {
            return (
                <Button
                    variant="contained"
                    className={styles.regButton}
                    onClick={() => navigate('/registration')}
                >
                    Regisztráció
                </Button>
            );
        }
    };

    const formatQualification = (text) => {
        return text
            .toLowerCase()
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const formatPhoneNumber = (phoneNumber) => {
        return phoneNumber.replace(/(\d{2})(\d{2})(\d{3})(\d{3})/, '+$1 ($2) $3-$4');
    };

    return (
        <>
            <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <div className={styles.pageWrapper}>
                <Navbar />
                <section className={styles.banner}>
                    <div className={styles.bannerOverlay}></div>
                    <div className={styles.bannerContent}>
                        <h1 className={styles.bannerTitle}>Érd el céljaid profi segítséggel</h1>
                        {handleRegButton()}
                    </div>
                </section>
                <Divider />
                <section className={styles.trainerSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Edzőink</h2>
                        <div className={styles.cardsContainer}>
                            <Grid container spacing={3} justifyContent="center">
                                {trainers.length > 0 ? (
                                    trainers.map((trainer, index) => {
                                        if (index < 5) {
                                            const imageUrl = trainerImages[trainer.id] || '';
                                            return (
                                                <Grid item key={trainer.id} xs={12} sm={6} md={4} lg={3}>
                                                    <Card variant="outlined" className={styles.card}>
                                                        <CardOverflow>
                                                            <AspectRatio ratio="4/5">
                                                                <div
                                                                    className={styles.trainerImage}
                                                                    style={{ backgroundImage: `url(${imageUrl})` }}
                                                                />
                                                            </AspectRatio>
                                                        </CardOverflow>
                                                        <CardContent className={styles.cardContent}>
                                                            <div>
                                                                <Typography level="h6">{trainer.name}</Typography>
                                                                <Typography>{formatPhoneNumber(trainer.phoneNumber)}</Typography>
                                                                <Typography>{formatQualification(trainer.qualification)}</Typography>
                                                            </div>
                                                            <div className={styles.rating}>
                                                                <span>{trainer.rating}</span>
                                                                <StarRateIcon className={styles.star} />
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            );
                                        }
                                        return null;
                                    })
                                ) : (
                                    <Typography level="h5" className={styles.trainerError}>
                                        Jelenleg egy edző sem dolgozik nálunk!
                                    </Typography>
                                )}
                            </Grid>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default LandingPage;