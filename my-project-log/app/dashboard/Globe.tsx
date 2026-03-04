"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Globe as GlobeIcon, X, AlertTriangle, ExternalLink, RotateCcw, Play, Pause, BarChart3 } from 'lucide-react';

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
  '巴基斯坦': [30.3753, 69.3451],
  '阿富汗': [33.9391, 67.7100],
  '土耳其': [38.9637, 35.2433],
  '埃及': [26.8206, 30.8025],
  '利比亚': [26.3351, 17.2283],
  '委内瑞拉': [6.4238, -66.5897],
  '缅甸': [21.9162, 95.9560],
  '菲律宾': [12.8797, 121.7740],
  '越南': [14.0583, 108.2772],
  '德国': [51.1657, 10.4515],
  '法国': [46.2276, 2.2137],
  '英国': [55.3781, -3.4360],
  '中国': [35.8617, 104.1954],
};

// 冲突关系定义
const conflictRelations: [string, string][] = [
  ['伊朗', '以色列'],
  ['伊朗', '美国'],
  ['俄罗斯', '乌克兰'],
  ['俄罗斯', '北约'],
  ['朝鲜', '韩国'],
  ['朝鲜', '美国'],
  ['中国', '台湾'],
  ['中国', '南海'],
  ['印度', '巴基斯坦'],
  ['叙利亚', '以色列'],
  ['土耳其', '叙利亚'],
];

interface GlobeViewerProps {
  crisisData: CrisisItem[];
}

function GlobeViewer({ crisisData }: GlobeViewerProps) {
  const globeEl = useRef<any>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [GlobeComponent, setGlobeComponent] = useState<any>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showArcs, setShowArcs] = useState(true);
  const [pulsePhase, setPulsePhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 脉冲动画效果
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(p => (p + 1) % 20);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // 动态加载 Globe 库
  useEffect(() => {
    let mounted = true;

    const loadGlobe = async () => {
      try {
        const module = await import('react-globe.gl');
        if (mounted && module.default) {
          setGlobeComponent(() => module.default);
        }
      } catch (err) {
        console.error('Load globe error:', err);
        if (mounted) {
          setLoadError('地球组件加载失败');
        }
      }
    };

    loadGlobe();

    return () => {
      mounted = false;
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

    updateDimensions();
    const timer = setTimeout(updateDimensions, 200);
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

    if (crisisData && Array.isArray(crisisData)) {
      crisisData.forEach((item) => {
        if (!item || !item.title) return;

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
    }

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

  // 生成冲突连接弧线
  const arcs = useMemo(() => {
    if (!showArcs || markers.length === 0) return [];

    const result: any[] = [];
    const markerRegions = new Set(markers.map(m => m.region));

    conflictRelations.forEach(([region1, region2]) => {
      if (markerRegions.has(region1) && markerRegions.has(region2)) {
        const coord1 = regionCoordinates[region1];
        const coord2 = regionCoordinates[region2];
        if (coord1 && coord2) {
          result.push({
            id: `${region1}-${region2}`,
            startLat: coord1[0],
            startLng: coord1[1],
            endLat: coord2[0],
            endLng: coord2[1],
            color: '#ef4444'
          });
        }
      }
    });

    return result;
  }, [markers, showArcs]);

  // 地区分布统计
  const regionStats = useMemo(() => {
    const stats: Record<string, number> = {};
    markers.forEach(m => {
      stats[m.region] = (stats[m.region] || 0) + 1;
    });
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [markers]);

  function getSentimentColor(sentiment?: string) {
    switch (sentiment) {
      case 'negative': return '#ef4444';
      case 'positive': return '#22c55e';
      default: return '#f97316';
    }
  }

  // 定位到指定位置
  const handleLocationClick = useCallback((point: any) => {
    if (!point || !globeEl.current) return;
    setSelectedMarker(point);
    try {
      globeEl.current.pointOfView({
        lat: point.lat,
        lng: point.lng,
        altitude: 1.5
      }, 1000);
    } catch (e) {
      console.error('pointOfView error:', e);
    }
  }, []);

  // 切换自动旋转
  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };

  // 加载中状态
  if (!GlobeComponent) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50">
        <GlobeIcon className="w-12 h-12 text-blue-500 animate-pulse mb-3" />
        <div className="text-zinc-500 text-sm">
          {loadError ? loadError : '正在加载地球模型...'}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#0a0a0a] overflow-hidden"
      style={{ lineHeight: 0 }}
    >
      {dimensions.width > 0 && (
        <GlobeComponent
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg"
          bumpImageUrl="https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png"
          cloudsImageUrl="https://unpkg.com/three-globe@2.31.0/example/img/earth-clouds.png"
          backgroundImageUrl="https://unpkg.com/three-globe@2.31.0/example/img/night-sky.png"
          atmosphereColor="rgba(59, 130, 246, 0.25)"
          atmosphereAltitude={0.12}
          pointsData={markers}
          pointColor={(d: any) => (d && d.color) || '#ef4444'}
          pointAltitude={0.015}
          pointRadius={(d: any) => {
            const baseSize = (d && d.size) || 0.5;
            const pulse = 1 + 0.2 * Math.sin(pulsePhase * 0.314);
            return baseSize * pulse * 0.8;
          }}
          pointsMerge={true}
          pointResolution={12}
          pointLabel={(d: any) => {
            if (!d) return '';
            const title = d.title || '';
            const region = d.region || '';
            const time = d.time || '';
            return `
              <div style="background: rgba(0,0,0,0.95); padding: 10px 14px; border-radius: 8px; border: 1px solid #3b82f6; max-width: 250px;">
                <div style="color: #fff; font-size: 13px; font-weight: bold; margin-bottom: 4px;">${title.substring(0, 50)}</div>
                <div style="color: #ef4444; font-size: 11px;">📍 ${region}</div>
                <div style="color: #888; font-size: 10px; margin-top: 4px;">${time}</div>
              </div>
            `;
          }}
          onPointClick={(d: any) => d && handleLocationClick(d)}
          arcsData={showArcs ? arcs : []}
          arcColor={(d: any) => (d && d.color) || '#ef4444'}
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={1500}
          arcStroke={0.8}
          arcAltitude={0.12}
          arcResolution={64}
          autoRotate={autoRotate}
          autoRotateSpeed={0.3}
          enablePointerInteraction={true}
          onGlobeClick={() => setSelectedMarker(null)}
        />
      )}

      {/* 顶部精简标题栏 */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2">
          <GlobeIcon className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-bold text-white">地缘热点</span>
          <span className="text-xs text-red-400 font-bold ml-1">{markers.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowArcs(!showArcs)}
            className={`p-1 rounded transition-colors ${showArcs ? 'bg-red-600/60' : 'bg-zinc-800/60 hover:bg-zinc-700/60'}`}
          >
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12h16M12 4v16" />
            </svg>
          </button>
          <button
            onClick={toggleAutoRotate}
            className="p-1 bg-zinc-800/60 hover:bg-zinc-700/60 rounded transition-colors"
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5 text-zinc-300" /> : <Play className="w-3.5 h-3.5 text-zinc-300" />}
          </button>
          <button
            onClick={() => {
              if (globeEl.current) {
                try {
                  globeEl.current.pointOfView({ lat: 30, lng: 0, altitude: 2.5 }, 1000);
                  setSelectedMarker(null);
                } catch (e) {
                  console.error('Reset view error:', e);
                }
              }
            }}
            className="p-1 bg-zinc-800/60 hover:bg-zinc-700/60 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-300" />
          </button>
        </div>
      </div>

      {/* 选中标记的详情面板 */}
      {selectedMarker && (
        <div className="absolute top-12 left-3 z-20 max-w-[200px] bg-black/90 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 shadow-xl">
          <button
            onClick={() => setSelectedMarker(null)}
            className="absolute top-1 right-1 text-zinc-500 hover:text-white p-0.5 hover:bg-zinc-800 rounded"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span className="text-xs font-bold text-white">{selectedMarker.region}</span>
          </div>

          <div className="text-[10px] text-zinc-500 mb-1.5">{selectedMarker.time}</div>

          <p className="text-[11px] text-zinc-300 leading-relaxed line-clamp-3">{selectedMarker.title}</p>

          {selectedMarker.url && (
            <a
              href={selectedMarker.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 mt-2"
            >
              查看原文 <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      )}

      {/* 底部左侧：热点地区快捷按钮 */}
      <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 flex-wrap max-w-[180px]">
        {markers.slice(0, 4).map((marker) => (
          <button
            key={marker.id}
            onClick={() => handleLocationClick(marker)}
            className={`px-1.5 py-0.5 text-[9px] rounded transition-colors flex items-center gap-1 backdrop-blur-sm ${
              selectedMarker?.id === marker.id
                ? 'bg-blue-600/80 text-white'
                : 'bg-black/50 text-zinc-400 hover:text-white hover:bg-black/70'
            }`}
          >
            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: marker.color }} />
            {marker.region}
          </button>
        ))}
        {markers.length > 4 && (
          <span className="text-[9px] text-zinc-600 px-1">+{markers.length - 4}</span>
        )}
      </div>

      {/* 底部右侧：图例 + 统计 */}
      <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5">
        <div className="flex items-center gap-1.5 text-[9px] bg-black/50 backdrop-blur-sm rounded px-1.5 py-0.5">
          <span className="w-1 h-1 rounded-full bg-red-500" />
          <span className="text-zinc-500">负面</span>
          <span className="w-1 h-1 rounded-full bg-orange-500" />
          <span className="text-zinc-500">中性</span>
        </div>

        <button
          onClick={() => setShowStats(!showStats)}
          className={`p-1 rounded backdrop-blur-sm transition-colors ${showStats ? 'bg-blue-600/60' : 'bg-black/50 hover:bg-black/70'}`}
        >
          <BarChart3 className="w-3 h-3 text-white" />
        </button>
      </div>

      {/* 统计面板 */}
      {showStats && regionStats.length > 0 && (
        <div className="absolute bottom-10 right-2 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-zinc-800/50 w-40">
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            {regionStats.slice(0, 6).map(([region, count], idx) => {
              const maxCount = regionStats[0][1];
              const barWidth = (count / maxCount) * 100;
              const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

              return (
                <div key={region} className="flex items-center gap-1">
                  <span className="text-[8px] text-zinc-500 truncate w-8">{region}</span>
                  <div className="flex-1 h-0.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: colors[idx % colors.length]
                      }}
                    />
                  </div>
                  <span className="text-[8px] text-zinc-600 w-3 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default GlobeViewer;
