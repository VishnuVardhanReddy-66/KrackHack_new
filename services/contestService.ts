
import { Contest } from '../types';

/**
 * Generates dynamic mock data when the external API is unreachable.
 */
const getFallbackContests = (): any[] => {
  const now = new Date();
  
  return [
    {
      name: "AEGIS Protocol Internal Sprint",
      url: "https://codeforces.com/contests",
      start_time: new Date(now.getTime() + 1000 * 60 * 60 * 1.5).toISOString(),
      end_time: new Date(now.getTime() + 1000 * 60 * 60 * 3.5).toISOString(),
      duration: "7200",
      site: "IIT Mandi Node",
      status: "BEFORE"
    },
    {
      name: "Codeforces Round #999 (Div. 2)",
      url: "https://codeforces.com/contests",
      start_time: new Date(now.getTime() + 1000 * 60 * 60 * 5).toISOString(),
      end_time: new Date(now.getTime() + 1000 * 60 * 60 * 7).toISOString(),
      duration: "7200",
      site: "CodeForces",
      status: "BEFORE"
    },
    {
      name: "LeetCode Weekly Contest 436",
      url: "https://leetcode.com/contest/",
      start_time: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      end_time: new Date(now.getTime() + 1000 * 60 * 60 * (24 * 2 + 1.5)).toISOString(),
      duration: "5400",
      site: "LeetCode",
      status: "BEFORE"
    },
    {
      name: "CodeChef Starters 170 (Rated)",
      url: "https://www.codechef.com/contests",
      start_time: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
      end_time: new Date(now.getTime() + 1000 * 60 * 60 * 2).toISOString(),
      duration: "10800",
      site: "CodeChef",
      status: "CODING"
    },
    {
      name: "AtCoder Regular Contest 180",
      url: "https://atcoder.jp/",
      start_time: new Date(now.getTime() + 1000 * 60 * 60 * 18).toISOString(),
      end_time: new Date(now.getTime() + 1000 * 60 * 60 * 20).toISOString(),
      duration: "7200",
      site: "AtCoder",
      status: "BEFORE"
    }
  ];
};

export const contestService = {
  /**
   * Fetches all contests from the Kontests API using a more reliable CORS proxy.
   * Data is normalized and sorted by start_time.
   */
  async fetchContests(): Promise<{ data: Contest[], isFallback: boolean }> {
    let rawData: any[] = [];
    let isFallback = false;
    
    try {
      // Switching to allorigins as it's often more reliable than corsproxy.io for 404/500 scenarios
      const targetUrl = 'https://kontests.net/api/v1/all';
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      rawData = await response.json();
    } catch (error) {
      console.warn("External Contest API unreachable. Activating fallback data node.", error);
      rawData = getFallbackContests();
      isFallback = true;
    }
    
    const now = new Date();

    const processed = rawData.map((item: any, index: number) => {
      const start = new Date(item.start_time);
      const end = new Date(item.end_time);

      let status: 'UPCOMING' | 'LIVE' | 'FINISHED' = 'UPCOMING';
      if (now >= start && now <= end) {
        status = 'LIVE';
      } else if (now > end) {
        status = 'FINISHED';
      }

      const durationSec = parseInt(item.duration) || 0;
      const hours = Math.floor(durationSec / 3600);
      const minutes = Math.floor((durationSec % 3600) / 60);
      const durationStr = hours > 0 ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}` : `${minutes}m`;

      const formattedDate = start.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short'
      });

      return {
        id: `${item.site}-${index}-${start.getTime()}`,
        platform: item.site,
        title: item.name,
        startTime: formattedDate,
        rawStartTime: item.start_time,
        endTime: item.end_time,
        duration: durationStr,
        link: item.url,
        status: status
      };
    })
    .sort((a, b) => new Date(a.rawStartTime).getTime() - new Date(b.rawStartTime).getTime());

    return { data: processed, isFallback };
  }
};