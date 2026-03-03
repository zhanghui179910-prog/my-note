"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Globe as GlobeIcon, X, AlertTriangle, ExternalLink, RotateCcw, Play, Pause } from 'lucide-react';

interface CrisisItem {
  title: string;
  time: string;
  intro?: string;
  url?: string;
  sentiment?: string;
}

// 地区坐标映射
const regionCoordinates: Record<string, [number, number]> = {
  '伊朗': [32.4279, 53.6880],
  '以色列': [31.0461, 34.8516],
  '沙特': [23.8859, 45.0792],
  '叙利亚': [34.8021, 38.9968],
  '伊拉克': [33.3152, 44.3661],
  '中东': [29.3117, 47.4818],
  '乌克兰': [48.3794, 31.1656],
  '俄罗斯': [61.5240, 105.3188],
  '北约': [52.1326, 5.2913],
  '欧洲': [54.5260, 15.2551],
  '朝鲜': [40.3399, 127.5101],
  '韩国': [35.9078, 127.7669],
  '台湾': [23.6978, 120.9605],
  '南海': [15.0000, 115.0000],
  '日本': [36.2048, 138.2529],
  '印度': [20.5937, 78.9629],
  '美国': [37.0902, -95.7129],
  '墨西哥': [23.6345, -102.5528],
};

interface GlobeViewerProps {
  crisisData: CrisisItem[];
}

function GlobeViewer({ crisisData }: GlobeViewerProps) {
  const globeEl = useRef<any>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [globeInstance, setGlobeInstance] = useState<any>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // 动态加载 Globe 库
  useEffect(() => {
    let isMounted = true;

    import('react-globe.gl').then((module) => {
      if (isMounted && module.default) {
        setGlobeInstance(() => module.default);
      }
    }).catch((err) => {
      console.error('Failed to load globe.gl:', err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // 处理窗口大小
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  // 从新闻标题提取地区
  const markers = useMemo(() => {
    const result: any[] = [];
    const usedTitles = new Set<string>();

    crisisData.forEach((item) => {
      let coords: [number, number] | null = null;
      let region = '';

      for (const [key, coord] of Object.entries(regionCoordinates)) {
        if (item.title.includes(key)) {
          coords = coord;
          region = key;
          break;
        }
      }

      if (coords && !usedTitles.has(item.title)) {
        usedTitles.add(item.title);
        result.push({
          id: result.length,
          lat: coords[0],
          lng: coords[1],
          title: item.title,
          time: item.time,
          intro: item.intro,
          url: item.url,
          region,
          size: 0.5 + Math.random() * 0.5,
          color: getSentimentColor(item.sentiment)
        });
      }
    });

    // 默认热点
    if (result.length === 0) {
      result.push(
        { id: 1, lat: 32.4279, lng: 53.6880, title: '中东地区动态', region: '伊朗', size: 0.8, color: '#ef4444' },
        { id: 2, lat: 48.3794, lng: 31.1656, title: '欧洲局势', region: '乌克兰', size: 0.6, color: '#f97316' },
        { id: 3, lat: 35.9078, lng: 127.7669, title: '亚太动态', region: '韩国', size: 0.5, color: '#eab308' },
        { id: 4, lat: 37.0902, lng: -95.7129, title: '美洲事务', region: '美国', size: 0.4, color: '#3b82f6' }
      );
    }

    return result;
  }, [crisisData]);

  function getSentimentColor(sentiment?: string) {
    switch (sentiment) {
      case 'negative': return '#ef4444';
      case 'positive': return '#22c55e';
      default: return '#f97316';
    }
  }

  // 定位到指定位置
  const handleLocationClick = useCallback((point: any) => {
    if (!point) return;
    setSelectedMarker(point);
    if (globeEl.current) {
      globeEl.current.pointOfView({
        lat: point.lat,
        lng: point.lng,
        altitude: 1.5
      }, 1000);
    }
  }, []);

  // 切换自动旋转
  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };

  // 加载中状态
  if (!globeInstance) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50">
        <GlobeIcon className="w-12 h-12 text-blue-500 animate-pulse mb-3" />
        <div className="text-zinc-500 text-sm">正在加载地球模型...</div>
      </div>
    );
  }

  const GlobeComponent = globeInstance;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[300px] bg-[#0a0a0a] rounded-xl overflow-hidden"
    >
      {dimensions.width > 0 && (
        <GlobeComponent
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          pointsData={markers}
          pointColor={(d: any) => d.color || '#ef4444'}
          pointAltitude={0.02}
          pointRadius={0.5}
          pointsMerge={true}
          pointLabel={(d: any) => {
            if (!d) return '';
            return `
              <div style="background: rgba(0,0,0,0.95); padding: 10px 14px; border-radius: 8px; border: 1px solid #3b82f6; max-width: 250px;">
                <div style="color: #fff; font-size: 13px; font-weight: bold; margin-bottom: 4px;">${(d.title || '').substring(0, 50)}</div>
                <div style="color: #ef4444; font-size: 11px;">📍 ${d.region || ''}</div>
                <div style="color: #888; font-size: 10px; margin-top: 4px;">${d.time || ''}</div>
              </div>
            `;
          }}
          onPointClick={handleLocationClick}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          enablePointerInteraction={true}
          onGlobeClick={() => setSelectedMarker(null)}
        />
      )}

      {/* 顶部标题栏 */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent px-4 py-3">
        <div className="flex items-center gap-2">
          <GlobeIcon className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-bold text-white">地缘热点分布</span>
          <span className="text-xs text-zinc-500">（点击热点查看详情）</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAutoRotate}
            className="p-1.5 bg-zinc-800/80 hover:bg-zinc-700 rounded-lg transition-colors"
            title={autoRotate ? '暂停旋转' : '自动旋转'}
          >
            {autoRotate ? (
              <Pause className="w-4 h-4 text-zinc-400" />
            ) : (
              <Play className="w-4 h-4 text-zinc-400" />
            )}
          </button>
          <button
            onClick={() => {
              if (globeEl.current) {
                globeEl.current.pointOfView({ lat: 30, lng: 0, altitude: 2.5 }, 1000);
                setSelectedMarker(null);
              }
            }}
            className="p-1.5 bg-zinc-800/80 hover:bg-zinc-700 rounded-lg transition-colors"
            title="重置视角"
          >
            <RotateCcw className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* 图例 */}
      <div className="absolute bottom-16 left-3 z-10 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-zinc-800">
        <div className="text-xs text-zinc-500 mb-1">风险等级</div>
        <div className="flex gap-3">
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> 高
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span> 中
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span> 低
          </span>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="absolute top-16 right-3 z-10 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-zinc-800">
        <div className="text-xs text-zinc-400">热点数量</div>
        <div className="text-2xl font-bold text-red-400">{markers.length}</div>
      </div>

      {/* 选中标记的详情面板 */}
      {selectedMarker && (
        <div className="absolute bottom-16 right-3 z-20 w-72 bg-[#0a0a0a] border border-blue-500/50 rounded-xl p-4 shadow-2xl">
          <button
            onClick={() => setSelectedMarker(null)}
            className="absolute top-2 right-2 text-zinc-500 hover:text-white p-1 hover:bg-zinc-800 rounded"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-bold text-white">{selectedMarker.region}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">热点</span>
          </div>

          <div className="text-xs text-zinc-500 mb-3">{selectedMarker.time}</div>

          <p className="text-sm text-zinc-300 leading-relaxed">
            {selectedMarker.title}
          </p>

          {selectedMarker.intro && (
            <p className="text-xs text-zinc-500 mt-2 line-clamp-2">
              {selectedMarker.intro}
            </p>
          )}

          <div className="flex gap-2 mt-3">
            {selectedMarker.url && (
              <a
                href={selectedMarker.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
              >
                查看原文 <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={() => handleLocationClick(selectedMarker)}
              className="text-xs text-zinc-500 hover:text-white"
            >
              重新定位
            </button>
          </div>
        </div>
      )}

      {/* 热点列表 */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-44 max-h-[250px] overflow-y-auto bg-black/70 backdrop-blur-sm rounded-lg border border-zinc-800 p-2">
        <div className="text-xs text-zinc-500 mb-2 px-2 font-medium">热点地区</div>
        {markers.map((marker) => (
          <button
            key={marker.id}
            onClick={() => handleLocationClick(marker)}
            className={`w-full text-left px-2 py-2 text-xs rounded transition-colors truncate flex items-center gap-2 ${
              selectedMarker?.id === marker.id
                ? 'bg-blue-600/30 text-blue-400 border border-blue-500/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: marker.color }}
            />
            <span className="truncate">{marker.region}</span>
          </button>
        ))}
      </div>

      {/* 交互提示 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 text-xs text-zinc-600">
        🖱️ 拖拽旋转 · 滚轮缩放 · 点击热点查看详情
      </div>
    </div>
  );
}

export default GlobeViewer;
