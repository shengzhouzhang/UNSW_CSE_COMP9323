#!/usr/bin/perl -w

die "Input prefix" if !@ARGV;
$command_d = 0;
$command_t = 0;

if($ARGV[0] =~ /-d/){
	$command_d = 1;
	shift(@ARGV);
}
elsif ($ARGV[0] =~ /-t/){
	$command_t = 1;
	shift(@ARGV);
}

for $hour (9..20){
	$table{'S1'}{"Mon"}{"$hour:00"} = 0;
	$table{"S1"}{"Tue"}{"$hour:00"} = 0;
	$table{"S1"}{"Wed"}{"$hour:00"} = 0;
	$table{"S1"}{"Thu"}{"$hour:00"} = 0;
	$table{"S1"}{"Fri"}{"$hour:00"} = 0;
	$table{"S2"}{"Mon"}{"$hour:00"} = 0;
	$table{"S2"}{"Tue"}{"$hour:00"} = 0;
	$table{"S2"}{"Wed"}{"$hour:00"} = 0;
	$table{"S2"}{"Thu"}{"$hour:00"} = 0;
	$table{"S2"}{"Fri"}{"$hour:00"} = 0;			
}

foreach $course (@ARGV){
	$url = "http://www.timetable.unsw.edu.au/current/$course.html";
	open F, "wget -q -O- $url|" or die;
	$semester_line = 0;
	$time_line = 0;
	$line_content = "";
	while ($line = <F>){
		chomp($line);
		if ($line =~ /Lecture<\/a>/){
			$semester_line = $. + 1;
			$time_line = $. + 6;	
		}
		if ($. eq $semester_line){
			$semester = $line;
			$semester =~ s/\s*<.*>T(\d)<.*>/$1/;
			#$semester =~ tr/T/S/;
			$semester = "S$semester";		
		}
		if ($. eq $time_line){
			$time = $line;
			$time =~ s/\s*<.*>(.*)(<.*>|0)/$1/;
			$line_content = "$course: $semester $time";
			$output{$course}{$semester}{$time}++;
		}
	}
	foreach $semester_key (keys %{$output{$course}}){
		foreach $time_key (keys %{$output{$course}{$semester_key}}){
			if($command_d or $command_t){
				@times = split(/,\s/, $time_key);
				foreach $time (@times){
					$day = $time;
					$day =~ s/^\s*(Mon|Tue|Wed|Thu|Fri|Sta|Sun).*$/$1/;
 					@duration = $time =~ /.*?(\d+)\:/g;
					for $hour ($duration[0]..$duration[1]-1){
						if($command_d){
							print "$semester_key $course $day $hour\n";
						}
						elsif($command_t){
							$table{$semester_key}{$day}{"$hour:00"}++;
						}
					}
				}					
			}
			else{	
				print "$course: $semester_key $time_key\n";
			}
		}
	}	
	#%output = ();
	close F;
}

if($command_t){
	foreach $semester_key (keys %table){
		print "$semester_key      Mon   Tue   Wed   Thu   Fri\n";
		for $hour (9..20){
			$mon = $table{$semester_key}{"Mon"}{"$hour:00"};
			$tue = $table{$semester_key}{"Tue"}{"$hour:00"};
			$wed = $table{$semester_key}{"Wed"}{"$hour:00"};
			$thu = $table{$semester_key}{"Thu"}{"$hour:00"};
			$fri = $table{$semester_key}{"Fri"}{"$hour:00"};
			if($hour == 9){
				print "0$hour:00    $mon     $tue     $wed     $thu     $fri\n";			
			}
			else{
				print "$hour:00    $mon     $tue     $wed     $thu     $fri\n";
			}
		}
	}
}


