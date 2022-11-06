
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import { Link } from "@mui/material";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { fontWeight, margin } from "@mui/system";
import Box from '@mui/material/Box';
import { match } from "assert";

export default function Tiles() {
    const [tiles, setTiles] = useState([])
    const [rotations, setRotations] = useState([])
    const [clickOne, setClickOne] = useState({ key: 0, emoji: null })
    const [clickTwo, setClickTwo] = useState({ key: 0, emoji: null })
    const [matched, setMatched] = useState([])
    const router = useRouter()
    const { level } = router.query
    const levelNum = parseInt(level)
    const nextLevel = levelNum + 1
    const [progress, setProgress] = useState({ level: 1, matched: matched, rotations: [], tiles: [] })




    function handleClick(i, e) {
        clickOne ? setClickTwo({ key: i, emoji: e }) : setClickOne({ key: i, emoji: e })

    }

    function resetClicks() {
        setClickOne(null)
        setClickTwo(null)

    }

    function emojiArrayGenerator() {

        const randomEmoji = require('random-emoji');
        const randomArray = randomEmoji.random({ count: levelNum });
        let random = []
        randomArray.map((emoji) => {
            random.push(emoji.character, emoji.character)

        })
        random.sort(() => Math.random() - 0.5)
        setTiles(random)
        return random;

    }

    function rotationArrayGenerator(count) {

        let randomRotations = []
        let i = 0
        let rotation
        while (i < count) {
            rotation = Math.random() * (0.9 - 0.001) + 0.001
            randomRotations.push(rotation)
            i++;

        }
        setRotations(randomRotations)
        return randomRotations;


    }



    useEffect(() => {
        if (router.asPath == "/tiles") {
            router.push("/tiles?level=1")
            router.query = 1
        }




    }, [])

    useEffect(() => {
        const local = JSON.parse(window.localStorage.getItem('progress'))



        if (local) {

            if (!level) return;
            else if (local.level == level) {
                setTiles(local.tiles)
                setMatched(local.matched)
                setRotations(local.rotations)

            }
            else if (local.level !== level) {
                console.log("NOT EQUAL LEVELS")

                const randomTiles = emojiArrayGenerator()
                const randomRotations = rotationArrayGenerator(level * 2)


                const newProgress = {
                    level: levelNum,
                    matched: [],
                    rotations: randomRotations,
                    tiles: randomTiles
                }

                setProgress(newProgress)
                window.localStorage.setItem('progress', JSON.stringify(newProgress))

            }

        }




    }, [level])





    useEffect(() => {
        const local = JSON.parse(window.localStorage.getItem('progress'))

        if (clickOne && clickTwo) {
            if (clickOne.emoji === clickTwo.emoji) {
                const prevMatched = [...local.matched]
                prevMatched.push(clickOne.emoji)
                const newMatched = prevMatched.filter(element => {
                    return element !== null;
                });
                const newProgress = {
                    level: local.level,
                    matched: newMatched,
                    rotations: local.rotations,
                    tiles: local.tiles
                }
                window.localStorage.setItem('progress', JSON.stringify(newProgress))

                setMatched(newMatched)
                resetClicks()
            }
            else {
                resetClicks()
            }
        }

    }, [clickOne, clickTwo])






    return (

        <div>
            <div className="title">
                <h1 sx={matched?.length > levelNum ? { display: "none" } : { display: "flex" }}>Level {levelNum}</h1>
                <Link className="levelLink" href={`/tiles?level=${nextLevel}`} sx={matched?.length < levelNum ? { display: "none" } : { display: "flex" }}> Level {nextLevel} 🡆</Link>

            </div>

            <Grid container spacing={{ xs: 2, md: 4 }} sx={{ padding: 2 }}>
                {tiles?.map((e, i) => (
                    <Grid item xs={2} key={i}>
                        <Button variant={clickOne?.key === i && clickOne?.emoji === e ? "contained" : "outlined"}
                            onClick={() => {
                                handleClick(i, e)
                            }}
                            size="large"
                            disabled={matched?.includes(e) ? true : false}
                        >
                            <Box sx={{
                                transform: `rotate(${rotations[i]}turn)`,
                            }}
                            >
                                {e}
                            </Box>

                        </Button>
                    </Grid>
                ))}


            </Grid>


        </div>

    )



}

