/** Impact & transparency — counters, fund-allocation chart, reports, registration. */
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Seo from '../components/Seo.jsx';
import PageHeader from '../components/PageHeader.jsx';
import ImpactCounters from '../components/ImpactCounters.jsx';
import { Section, Eyebrow, Loading } from '../components/ui.jsx';
import { getTransparency } from '../lib/api.js';
import { paiseToINR } from '../lib/format.js';
import { DownloadIcon } from '../components/icons.jsx';
import { ORG } from '../lib/site.js';

const COLORS = { programPct: '#1E6B5C', adminPct: '#E58A2E', fundraisingPct: '#5B6B66' };

function AllocationChart({ record }) {
  const data = [
    { name: 'Programmes', key: 'programPct', value: record.programPct },
    { name: 'Administration', key: 'adminPct', value: record.adminPct },
    { name: 'Fundraising', key: 'fundraisingPct', value: record.fundraisingPct },
  ];
  return (
    <div className="card p-7">
      <Eyebrow>Where your money goes · {record.year}</Eyebrow>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={90}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((d) => (
                <Cell key={d.key} fill={COLORS[d.key]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `${v}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-center text-sm text-slate">
        <span className="data font-semibold text-ink">{record.programPct}%</span> of funds reached
        programmes in {record.year}.
      </p>
    </div>
  );
}

function ReportsTable({ records }) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-paper-deep/50 text-slate">
          <tr>
            <th className="px-5 py-3 font-semibold">Year</th>
            <th className="px-5 py-3 font-semibold">Total raised</th>
            <th className="px-5 py-3 font-semibold">To programmes</th>
            <th className="px-5 py-3 font-semibold text-right">Report</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/8">
          {records.map((r) => (
            <tr key={r.year}>
              <td className="px-5 py-3 data text-ink">{r.year}</td>
              <td className="px-5 py-3 data text-ink">{paiseToINR(r.totalRaisedInPaise)}</td>
              <td className="px-5 py-3 data text-healing">{r.programPct}%</td>
              <td className="px-5 py-3 text-right">
                <a
                  href={r.reportUrl || '#'}
                  className="inline-flex items-center gap-1.5 font-semibold text-healing hover:underline"
                >
                  <DownloadIcon width={16} height={16} /> PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Impact() {
  const { data: records, isLoading } = useQuery({
    queryKey: ['transparency'],
    queryFn: getTransparency,
  });
  const latest = records?.[0];

  return (
    <>
      <Seo
        title="Impact & transparency"
        path="/impact"
        description="See our reach in numbers and exactly where every rupee goes — full annual reports and financials."
      />
      <PageHeader
        eyebrow="Accountability"
        title="The receipts, in the open."
        intro="We publish our reach and our finances in full. Trust is the medicine that makes the rest work."
      />

      <Section>
        <ImpactCounters />
      </Section>

      <div className="bg-paper-deep/40">
        <Section>
          <div className="grid gap-8 md:grid-cols-2">
            {isLoading ? (
              <Loading />
            ) : latest ? (
              <>
                <AllocationChart record={latest} />
                <div>
                  <Eyebrow>Annual reports &amp; financials</Eyebrow>
                  <h2 className="mt-3 font-display text-2xl text-ink">Read the full books</h2>
                  <p className="mt-2 text-slate">
                    Audited financial statements and programme reports for every year since we
                    received 80G/12A registration.
                  </p>
                  <div className="mt-5">
                    <ReportsTable records={records} />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </Section>
      </div>

      <Section>
        <div className="card grid gap-6 p-8 md:grid-cols-4 md:p-10">
          {[
            ['Registration No.', ORG.regNo],
            ['80G', ORG.reg80G],
            ['12A', ORG.reg12A],
            ['CSR-1', ORG.csr1],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-xs uppercase tracking-wider text-slate">{k}</p>
              <p className="data mt-1 text-ink">{v}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
