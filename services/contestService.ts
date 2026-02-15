
import { Contest } from '../types';

/**
 * Generates dynamic mock data when the external API is unreachable.
 * Updated to provide a rich set of contests for a full calendar view.
 */
const getFallbackContests = (): any[] => {
  const now = new Date();
  const year = 2026;
  const month = 2; // March (0-indexed)
  
  const createDate = (day: number, hour: number) => new Date(year, month, day, hour).toISOString();

  return [
    {
      name: "AEGIS Protocol Internal Sprint",
      url: "https://codeforces.com/contests",
      start_time: new Date(now.getTime() + 1000 * 60 * 60 * 2.5).toISOString(),
      end_time: new Date(now.getTime() + 1000 * 60 * 60 * 4.5).toISOString(),
      duration: "7200",
      site: "IIT Mandi Node",
      status: "BEFORE"
    },
    {
      name: "Codeforces Round #999 (Div. 2)",
      url: "https://codeforces.com/contests",
      start_time: createDate(5, 18),
      end_time: createDate(5, 20),
      duration: "7200",
      site: "CodeForces",
      status: "BEFORE"
    },
    {
      name: "AtCoder Regular Contest 180",
      url: "https://atcoder.jp/",
      start_time: createDate(8, 17),
      end_time: createDate(8, 19),
      duration: "7200",
      site: "AtCoder",
      status: "BEFORE"
    },
    {
      name: "LeetCode Weekly Contest 436",
      url: "https://leetcode.com/contest/",
      start_time: createDate(12, 8),
      end_time: createDate(12, 10),
      duration: "7200",
      site: "LeetCode",
      status: "BEFORE"
    },
    {
      name: "Google Kickstart Round A",
      url: "https://codingcompetitions.withgoogle.com/",
      start_time: createDate(15, 14),
      end_time: createDate(15, 17),
      duration: "10800",
      site: "Google",
      status: "BEFORE"
    },
    {
      name: "CodeChef Starters 170 (Rated)",
      url: "https://www.codechef.com/contests",
      start_time: createDate(18, 20),
      end_time: createDate(18, 23),
      duration: "10800",
      site: "CodeChef",
      status: "BEFORE"
    },
    {
      name: "TopCoder SRM 850",
      url: "https://www.topcoder.com/challenges",
      start_time: createDate(22, 19),
      end_time: createDate(22, 21),
      duration: "7200",
      site: "TopCoder",
      status: "BEFORE"
    },
    {
      name: "CSES Programming League",
      url: "https://cses.fi/",
      start_time: createDate(25, 10),
      end_time: createDate(25, 13),
      duration: "10800",
      site: "CSES",
      status: "BEFORE"
    },
    {
      name: "BinarySearch Biohazard Contest",
      url: "https://binarysearch.com/",
      start_time: createDate(28, 21),
      end_time: createDate(28, 23),
      duration: "7200",
      site: "BinarySearch",
      status: "BEFORE"
    },
    {
      name: "Hackerrank University CodeSprint",
      url: "https://www.hackerrank.com/",
      start_time: createDate(30, 15),
      end_time: createDate(30, 18),
      duration: "10800",
      site: "HackerRank",
      status: "BEFORE"
    },
    {
      name: "Competitive Programming Node #1",
      url: "#",
      start_time: createDate(2, 20),
      end_time: createDate(2, 22),
      duration: "7200",
      site: "Kattis",
      status: "BEFORE"
    },
    {
      name: "Global Marathon 2026",
      url: "#",
      start_time: createDate(10, 9),
      end_time: createDate(10, 21),
      duration: "43200",
      site: "Hackerrank",
      status: "BEFORE"
    },
    {
      name: "Frontend Algorithms Cup",
      url: "#",
      start_time: createDate(20, 19),
      end_time: createDate(20, 21),
      duration: "7200",
      site: "LeetCode",
      status: "BEFORE"
    },
    {
      name: "Backend Optimization Sprint",
      url: "#",
      start_time: createDate(24, 18),
      end_time: createDate(24, 20),
      duration: "7200",
      site: "CodeForces",
      status: "BEFORE"
    },
    {
      name: "Night Owls Coding #12",
      url: "#",
      start_time: createDate(27, 23),
      end_time: createDate(28, 2),
      duration: "10800",
      site: "AtCoder",
      status: "BEFORE"
    }
  ];
};

export const contestService = {
  /**
   * Fetches all contests from the Kontests API using a reliable CORS proxy and timeout.
   */
  async fetchContests(): Promise<{ data: Contest[], isFallback: boolean }> {
    let rawData: any[] = [];
    let isFallback = false;
    
    // Create an AbortController to handle request timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); 

    try {
      const targetUrl = 'https://kontests.net/api/v1/all';
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      rawData = await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
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
