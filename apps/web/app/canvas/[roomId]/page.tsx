"use client"
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import InitDraw from "../../../draw";

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const params = useParams();
    const roomId = Array.isArray(params.roomid) ? params.roomid[0] : params.roomid;
    const [dimensions, setDimensions] = useState({ width: 2000, height: 1000 });

    useEffect(()=>{
        const canvas = canvasRef.current
        if (typeof window == "undefined") {
            return;
        }
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        });
        if (!canvas) return;
        
        InitDraw(canvas);
    }, [canvasRef])
    return (
        
        <canvas ref={canvasRef} key={roomId} height={dimensions.height} width={dimensions.width}></canvas>
    )
}