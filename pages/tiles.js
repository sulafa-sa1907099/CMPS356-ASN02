
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import { Link } from "@mui/material";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import * as emoji from "emoji-api";
import Button from '@mui/material/Button';
import { fontWeight, margin } from "@mui/system";
import Box from '@mui/material/Box';
import { match } from "assert";


export default function Tiles() {
    // const [level, setLevel] = useState(5)
    const [tiles, setTiles] = useState([])
    const [rotations, setRotations] = useState([])
    const [clickOne, setClickOne] = useState({ key: 0, emoji: null })
    const [clickTwo, setClickTwo] = useState({ key: 0, emoji: null })
    const [matched, setMatched] = useState([])
    const router = useRouter()
    const { level } = router.query
    const levelNum = parseInt(level)
    const nextLevel = levelNum + 1
    const [progress, setProgress] = useState({ level: 1, matched: [], rotations: [], tiles: [] })




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
        setProgress(prevProgress => {
            prevProgress = { ...progress }
            prevProgress.tiles = random
            return prevProgress
        })


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
        setProgress(prevProgress => {
            prevProgress = { ...progress }
            prevProgress.rotations = randomRotations
            return prevProgress

        })


    }



    useEffect(() => {
        if (router.asPath == "/tiles") {
            router.push("/tiles?level=1")
            router.query = 1
        }

        const newProgress = {
            level: levelNum,
            matched: matched,
            rotations: rotations,
            tiles: tiles
        }
        // setProgress(JSON.parse(window.localStorage.getItem('progress')))
        // if (typeof window == 'undefined')
        // window.localStorage.setItem('progress',newProgress);

        // setProgress(() => {
        //     const progress = localStorage.getItem("progress")
        //         ? JSON.parse(localStorage.getItem("progress"))
        //         : {};
        //     setLoaded(true);
        //     return progress;
        // });


        console.log(`empty array fired ${tiles}`)

    }, [])

    useEffect(() => {
        if (!level)
            return;

        // setProgress(prevProgress => {
        //     prevProgress = { ...progress }
        //     prevProgress.level = levelNum
        //     return prevProgress

        // })
        
        emojiArrayGenerator()

        const newProgress = {
            level: levelNum,
            matched: matched,
            rotations: rotations,
            tiles: tiles
        }

        setProgress(newProgress)
    
   



        console.log("level array fired")


    }, [level])

    useEffect(() => {
        const local = JSON.parse(window.localStorage.getItem('progress'))
        console.log(local.rotations)
      
        rotationArrayGenerator(tiles.length)
       
        
        console.log(`tiles array fired ${tiles}`)


        console.log(`tiles from progress: ${(progress.tiles)}`)
        const newProgress = {
            level: levelNum,
            matched: matched,
            rotations: rotations,
            tiles: tiles
        }

        setProgress(newProgress)


    }, [tiles])

    useEffect(() => {


        const newProgress = {
            level: levelNum,
            matched: matched,
            rotations: rotations,
            tiles: tiles
        }

        setProgress(newProgress)


    }, [rotations])

    useEffect(() => {
        if (clickOne && clickTwo) {
            // console.log(clickOne, clickTwo)
            if (clickOne.emoji === clickTwo.emoji) {
                // console.log("these emojis match!")
                setMatched(prevMatched => {
                    prevMatched = [...matched]
                    prevMatched.push(clickOne.emoji)
                    return prevMatched
                })

                resetClicks()
            }
            else {
                // console.log("these emojis do not match! :(")
                resetClicks()
            }
        }

    }, [clickOne, clickTwo])



    useEffect(() => {

        const newProgress = {
            level: levelNum,
            matched: matched,
            rotations: rotations,
            tiles: tiles
        }

        setProgress(newProgress)

        console.log(`matched array fired ${matched}`)


    }, [matched])

    useEffect(() => {


        console.log(`tiles from progress: ${(progress.tiles)}`)
        console.log(`rotations from progress: ${(progress.rotations)}`)
        console.log(`level from progress: ${(progress.level)}`)
        console.log(`progress: ${(JSON.stringify(progress))}`)
        window.localStorage.setItem('progress', JSON.stringify(progress))


    }, [progress])






    return (

        <div>
            <div className="title">
                <h1 sx={matched.length > levelNum ? { display: "none" } : { display: "flex" }}>Level {levelNum}</h1>
                <Link className="levelLink" href={`/tiles?level=${nextLevel}`} sx={matched.length <= levelNum ? { display: "none" } : { display: "flex" }}>Level {nextLevel}</Link>

            </div>

            <Grid container spacing={{ xs: 2, md: 4 }} sx={{ padding: 2 }}>
                {tiles?.map((e, i) => (
                    <Grid item xs={2} key={i}>
                        <Button variant={clickOne?.key === i && clickOne?.emoji === e ? "contained" : "outlined"}
                            onClick={() => {
                                handleClick(i, e)
                            }}
                            size="large"
                            disabled={matched.includes(e) ? true : false}
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

